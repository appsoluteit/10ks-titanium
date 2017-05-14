### 10KSteps App Docs ###

This is the unofficial documentation for the 10KSteps Alloy application. As well as the source code,
this document can be referred to for details as to how the 10K steps app functions. For API documentation,
see the file located under `<project_folder>/api/doc/`.

#### Generating this documentation ####

To generate this documentation, you will need to perform the following steps

1. Install JSDoc.
    `npm install -g jsdoc`

2. Navigate to the app folder.
    `cd <project_folder>/ti/app/`

3. Run JSDoc
    `jsdoc --readme ../../README.md . -r -c ../../conf.json -d ../../ti-doc`

The above jsdoc command will run jsdoc in the current folder (which, if you performed step 2 correctly, will be the app folder).
It runs recursively and will use the config file (conf.json) in the project root folder. The output destination is the ti-doc folder
also in the project root folder.

#### Dependencies ####

Below are all of the dependencies of the app project which are not included (or expected) by Appcelerator Studio by default.

1. Chai. Assertion library.
2. Ti-Mocha. Unit testing framework.
3. Q. JavaScript Promise polyfill library for backwards compatibility.
4. (Widget) Highcharts. Charting widget used in the statistics screen.
5. (Widget) Toast. Toast widget for success / fail in-app notifications.
6. (Widget) Loading. A loading spinner for asynchronous operations.

#### Configuration ####

The following should be included in tiapp.xml (not tracked in source control) in order to build and run the project successfully.

```
<?xml version="1.0" encoding="UTF-8"?>
<ti:app xmlns:ti="http://ti.appcelerator.org">
    <ios>
        <plist>
            <dict>
                <key>UISupportedInterfaceOrientations~iphone</key>
                <array>
                    <string>UIInterfaceOrientationPortrait</string>
                </array>
                <key>UISupportedInterfaceOrientations~ipad</key>
                <array>
                    <string>UIInterfaceOrientationPortrait</string>
                    <string>UIInterfaceOrientationPortraitUpsideDown</string>
                    <string>UIInterfaceOrientationLandscapeLeft</string>
                    <string>UIInterfaceOrientationLandscapeRight</string>
                </array>
                <key>UIRequiresPersistentWiFi</key>
                <false/>
                <key>UIPrerenderedIcon</key>
                <false/>
                <key>UIStatusBarHidden</key>
                <false/>
                <key>UIStatusBarStyle</key>
                <string>UIStatusBarStyleDefault</string>
                <key>NSCalendarsUsageDescription</key>
                <string>Setting reminders to log your steps</string>
            </dict>
        </plist>
    </ios>
    <android xmlns:android="http://schemas.android.com/apk/res/android">
        <manifest>
            <application android:theme="@style/Theme.AppCompat.Light"/>
            <uses-permission android:name="android.permission.READ_CALENDAR"/>
            <uses-permission android:name="android.permission.WRITE_CALENDAR"/>
        </manifest>
    </android>
    <mobileweb>
        <precache/>
        <splash>
            <enabled>true</enabled>
            <inline-css-images>true</inline-css-images>
        </splash>
        <theme>default</theme>
    </mobileweb>
</ti:app>
```

*This document is a work in progress*
