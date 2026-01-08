# Notan Study
This is a React Native mobile app which aims to help artists analyze images by breaking them into simplified value-based compositions. It allows users study tone, contrast, and shape to improve sketches, thumbnails, and visual design skills

## Features
* Posterization - reduces an image to a limited number of tones
* Threshold Adjuster – fine-tune the range of values for each level
* Simplicity - applies bilateral filtering to smooth image regions
* Focus/Blur Control - adds Gaussian blur for edge softness or selective focus
* Histogram - visualizes brightness distribution and contrast
  
## Tech Stack
This project is built using React Native with TypeScript, Kotlin Native Module and OpenCV for image processing.

## Run Locally

Prerequisites:
* Node.js installed
* React Native CLI
* Android Studio
* Java Development Kit (JDK)

Clone the project

```bash
 git clone https://github.com/emlznv/notan-study.git
 ```

Set up OpenCV

1. Go to the OpenCV official site, download the OpenCV Android SDK and extract the zip.

2. Import into Android Studio:
File → New → Import Module → sdk/java → name it opencv.

3. Copy native libraries:
Copy the contents of ``sdk/native/libs/staticlibs`` to ``android/opencv/src/main/jniLibs``

4. Copy Java sources:
Copy the contents of ``sdk/java/src`` to ``android/opencv/src/main/java``

5. Copy resources:
Copy the contents of ``sdk/java/res/values`` to ``android/opencv/src/main/res/values``

6. The content of the file ``android/opencv/build.gradle`` should be:

```
apply plugin: 'com.android.library'

android {
    namespace "org.opencv" 
    compileSdkVersion 35 // ← Match with your app module
    buildToolsVersion "35.0.0" // ← Match with your app module

    defaultConfig {
        minSdkVersion 24 // ← Match with your app module
        targetSdkVersion 35 // ← Match with your app module
    }

    sourceSets {
        main {
            java.srcDirs = ['src']
            jniLibs.srcDirs = ['src/main/jniLibs']
            manifest.srcFile 'AndroidManifest.xml'
        }
    }
}
```
Install dependencies
```bash
 npm install
 ```

Connect phone with USB or use Android Emulator and run metro:
```bash
 npm start
```

Build and run the app:
```bash
 npm run android
```
