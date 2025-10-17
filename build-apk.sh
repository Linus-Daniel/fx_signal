#!/bin/bash

echo "🚀 Building Forex Signals Pro APK..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --force
fi

# Install dependencies with force to resolve peer dependency issues
echo "🔧 Resolving dependencies..."
npm install --force > /dev/null 2>&1

# Build using EAS
echo "🏗️ Building APK with EAS..."
npx eas build --profile preview --platform android --non-interactive

# Alternative: Build using npx expo prebuild and gradlew
if [ $? -ne 0 ]; then
    echo "⚠️ EAS build failed, trying alternative method..."
    
    echo "📱 Running prebuild..."
    npx expo prebuild --platform android --clean
    
    if [ -d "android" ]; then
        echo "🔨 Building with Gradle..."
        cd android
        ./gradlew assembleRelease
        
        if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
            echo "✅ APK built successfully!"
            echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
            cp app/build/outputs/apk/release/app-release.apk ../forex-signals-pro.apk
            echo "📱 APK copied to: forex-signals-pro.apk"
        else
            echo "❌ APK build failed"
            exit 1
        fi
        cd ..
    else
        echo "❌ Android folder not found after prebuild"
        exit 1
    fi
fi

echo "🎉 Build process completed!"