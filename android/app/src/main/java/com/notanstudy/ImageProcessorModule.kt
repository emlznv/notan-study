package com.notanstudy

import com.facebook.react.bridge.*
import org.opencv.core.*
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.io.File

class ImageProcessorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    // Helper function to resize image for preview
    private fun resizeForPreview(mat: Mat, maxPreviewSize: Int = 384): Mat {
        val width = mat.width()
        val height = mat.height()
        val scale = if (width > height) maxPreviewSize.toDouble() / width else maxPreviewSize.toDouble() / height
        return if (scale < 1.0) {
            val newWidth = Math.round(width * scale).toInt()
            val newHeight = Math.round(height * scale).toInt()
            val resized = Mat()
            Imgproc.resize(mat, resized, Size(newWidth.toDouble(), newHeight.toDouble()))
            mat.release()
            resized
        } else {
            mat
        }
    }

    override fun getName() = "ImageProcessor"

   @ReactMethod
    fun processImage(imagePath: String, tones: Int, simplicity: Int, focusBlur: Int, promise: Promise) {
        try {
            if (tones <= 0) {
                promise.reject("INVALID_TONES", "Tones must be greater than 0")
                return
            }

            // Clean up the URI prefix if present
            val cleanPath = if (imagePath.startsWith("file://")) imagePath.removePrefix("file://") else imagePath

            // Load original color image
            val matColor = Imgcodecs.imread(cleanPath)
            if (matColor.empty()) {
                promise.reject("IMAGE_LOAD_FAILED", "Failed to load image at path: $imagePath")
                return
            }

            val matToProcess = resizeForPreview(matColor)

            // Apply simplicity-based smoothing before processing
            val smoothedMat = if (simplicity > 0) {
                val blurStrength = simplicity.toDouble()
                val smoothed = Mat()
                Imgproc.bilateralFilter(matToProcess, smoothed, 9, blurStrength * 10, blurStrength * 10)
                matToProcess.release()  // release old mat
                smoothed
            } else {
                matToProcess
            }

            // --- Focus/Blur (Edge Softness) ---
            val focusBlurredMat = if (focusBlur > 0) {
                val blurred = Mat()
                // Use Gaussian blur for edge softness, kernel size must be odd and > 1
                val kernelSize = if (focusBlur % 2 == 0) focusBlur + 1 else focusBlur
                Imgproc.GaussianBlur(smoothedMat, blurred, Size(kernelSize.toDouble(), kernelSize.toDouble()), 0.0)
                smoothedMat.release()
                blurred
            } else {
                smoothedMat
            }

            val resultPath = processAndSave(focusBlurredMat, tones)
            if (resultPath == null) {
                promise.reject("PROCESS_ERROR", "Image processing failed")
            } else {
                promise.resolve(resultPath)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("PROCESS_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getHistogram(imagePath: String, promise: Promise) {
        try {
            val cleanPath = if (imagePath.startsWith("file://")) imagePath.removePrefix("file://") else imagePath

            val matColor = Imgcodecs.imread(cleanPath)
            if (matColor.empty()) {
                promise.reject("IMAGE_LOAD_FAILED", "Failed to load image at path: $imagePath")
                return
            }

            // Convert to grayscale
            val matGray = Mat()
            Imgproc.cvtColor(matColor, matGray, Imgproc.COLOR_BGR2GRAY)

            val histSize = MatOfInt(256)  // 256 bins
            val channels = MatOfInt(0)    // grayscale channel
            val histRange = MatOfFloat(0f, 256f)
            val hist = Mat()

            Imgproc.calcHist(listOf(matGray), channels, Mat(), hist, histSize, histRange)

            // Convert histogram Mat to a Kotlin List<Float> to send back to JS
            val histList = mutableListOf<Float>()
            for (i in 0 until hist.rows()) {
                histList.add(hist.get(i, 0)[0].toFloat())
            }

            // Send histogram data back
            promise.resolve(Arguments.makeNativeArray(histList))
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("HISTOGRAM_ERROR", e.message)
        }
    }

    @ReactMethod
    fun applyThreshold(imagePath: String, thresholdValues: ReadableArray, promise: Promise) {
        try {
            val cleanPath = if (imagePath.startsWith("file://")) imagePath.removePrefix("file://") else imagePath

            val matColor = Imgcodecs.imread(cleanPath)
            if (matColor.empty()) {
                promise.reject("IMAGE_LOAD_FAILED", "Failed to load image at path: $imagePath")
                return
            }

            val matToProcess = resizeForPreview(matColor)

            val matGray = Mat()
            Imgproc.cvtColor(matToProcess, matGray, Imgproc.COLOR_BGR2GRAY)

            val thresholds = (0 until thresholdValues.size())
                .map { thresholdValues.getInt(it) }
                .sorted()

            // Multi-level thresholding: assign each pixel a value based on which range it falls into
            val matThresh = Mat(matGray.size(), CvType.CV_8U)
            for (row in 0 until matGray.rows()) {
                for (col in 0 until matGray.cols()) {
                    val pixel = matGray.get(row, col)[0].toInt()
                    var value = 0
                    for (i in thresholds.indices) {
                        if (pixel > thresholds[i]) {
                            value = ((255.0 / (thresholds.size + 1)) * (i + 1)).toInt()
                        } else {
                            break
                        }
                    }
                    matThresh.put(row, col, value.toDouble())
                }
            }

            val outputFile = File(reactApplicationContext.cacheDir, "threshold_${java.util.UUID.randomUUID()}.jpg")
            Imgcodecs.imwrite(outputFile.absolutePath, matThresh)

            promise.resolve(outputFile.absolutePath)
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("PROCESS_ERROR", e.message)
        }
    }



    // Helper function to process and save the image, returns the output file path
    private fun processAndSave(matColor: Mat, tones: Int): String? {
        // Convert to grayscale (1 channel)
        val mat = Mat()
        Imgproc.cvtColor(matColor, mat, Imgproc.COLOR_BGR2GRAY)

        // Reshape grayscale image to a 2D matrix (num_pixels x 1)
        val samples = mat.reshape(1, mat.rows() * mat.cols())

        // Convert samples to float type CV_32F
        val samples32f = Mat()
        samples.convertTo(samples32f, CvType.CV_32F)

        // Validate input for kmeans
        if (samples32f.dims() != 2 || samples32f.type() != CvType.CV_32F) {
            return null
        }

        val labels = Mat()
        val centers = Mat()

        // Run kmeans clustering
        Core.kmeans(
            samples32f,
            tones,
            labels,
            TermCriteria(TermCriteria.EPS + TermCriteria.MAX_ITER, 10, 1.0),
            3,
            Core.KMEANS_PP_CENTERS,
            centers
        )

        // Assign each pixel the center value of its cluster
        val newPixels = Mat(samples32f.rows(), 1, samples32f.type())
        for (i in 0 until samples32f.rows()) {
            val clusterIdx = labels.get(i, 0)[0].toInt()
            val centerValue = centers.get(clusterIdx, 0)[0]
            newPixels.put(i, 0, centerValue)
        }

        // Reshape back to original image shape (single channel)
        val clustered = newPixels.reshape(1, mat.rows())
        clustered.convertTo(clustered, CvType.CV_8U)

        // Clear old processed images from cache
        reactApplicationContext.cacheDir.listFiles()?.forEach {
            if (it.name.startsWith("processed_")) {
                it.delete()
            }
        }

        // Save clustered image to cache directory
        val outputFile = File(reactApplicationContext.cacheDir, "processed_${java.util.UUID.randomUUID()}.jpg")
        Imgcodecs.imwrite(outputFile.absolutePath, clustered)

        return outputFile.absolutePath
    }
}
