package com.notanstudy

import com.facebook.react.bridge.*
import org.opencv.core.*
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.io.File

class ImageProcessorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ImageProcessor"

   @ReactMethod
    fun processImage(imagePath: String, tones: Int, simplicity: Int, promise: Promise) {
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

            // Resize image for faster preview (max 384px on longest side)
            val maxPreviewSize = 384
            val width = matColor.width()
            val height = matColor.height()
            val scale = if (width > height) maxPreviewSize.toDouble() / width else maxPreviewSize.toDouble() / height
            val matToProcess = if (scale < 1.0) {
                val newWidth = Math.round(width * scale).toInt()
                val newHeight = Math.round(height * scale).toInt()
                val resized = Mat()
                org.opencv.imgproc.Imgproc.resize(matColor, resized, Size(newWidth.toDouble(), newHeight.toDouble()))
                matColor.release()
                resized
            } else {
                matColor
            }

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

            val resultPath = processAndSave(smoothedMat, tones)
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
