#\!/bin/bash

# Fix for PhaseScriptExecution error
echo "Applying Xcode build fixes..."

# Find and modify the Xcode project file to disable script sandboxing
PROJECT_FILE="/Users/macos/Documents/AI projects/Alarm_app/AlarmApp/ios/AlarmApp.xcodeproj/project.pbxproj"

if [ -f "$PROJECT_FILE" ]; then
    # Backup the original file
    cp "$PROJECT_FILE" "$PROJECT_FILE.backup"
    
    # Add ENABLE_USER_SCRIPT_SANDBOXING = NO to build settings
    sed -i '' 's/ENABLE_BITCODE = NO;/ENABLE_BITCODE = NO;\
				ENABLE_USER_SCRIPT_SANDBOXING = NO;/g' "$PROJECT_FILE"
    
    echo "Applied script sandboxing fix to Xcode project"
else
    echo "Project file not found at $PROJECT_FILE"
fi

echo "Build fixes applied successfully\!"
