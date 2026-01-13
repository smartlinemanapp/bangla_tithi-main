# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Preserve line numbers for deobfuscated stack traces
-keepattributes SourceFile,LineNumberTable

# Capacitor specific rules
-keep public class com.getcapacitor.Bridge { *; }
-keep public class com.getcapacitor.Plugin { *; }
-keep public class com.getcapacitor.JSObject { *; }
-keep public class com.getcapacitor.JSArray { *; }
-keep public class * extends com.getcapacitor.Plugin { *; }

# If you use RevenueCat or other plugins, keep their classes too
-keep class com.revenuecat.purchases.** { *; }
