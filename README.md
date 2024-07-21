# Tremola Checkers

This README provides instructions on how to set up and build Checkers game build on top of Offline-First android messanger Tremola. Follow these steps to ensure you have the necessary tools and configurations in place.

## Prerequisites

Before you can build the project, make sure you have the following installed:

1. **Java Development Kit (JDK) 11**: This project requires Java 11. You can download it from [Here](https://adoptium.net/temurin/releases/?arch=x64&package=jdk&version=11) .

2. **Android SDK**: Ensure you have the Android SDK installed. You can download it from the [Android Developers website](https://developer.android.com/studio).

## Setup Instructions

### 1. Clone the Repository

First, clone the repository to your local machine using Git.

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Configure Java Version

Ensure that the `gradle.properties` file specifies Java 11. It should contain the following line:

```properties
org.gradle.java.home=/path/to/java11
```

Replace `/path/to/java11` with the actual path to your JDK 11 installation.

### 3. Configure Android SDK

The `local.properties` file should specify the location of your Android SDK. Create or update this file in the root of your project directory with the following content:

```properties
sdk.dir=/path/to/your/android-sdk
```

Replace `/path/to/your/android-sdk` with the actual path to your Android SDK installation.

### 4. Build the Project

With Java 11 and the Android SDK configured, you can now build the project using Gradle. Run the following command in the root of your project directory:

```bash
./gradlew build
```

This command will compile the project and assemble the APKs.

By following these steps, you should be able to successfully set up and build your Android application project. Happy coding!
