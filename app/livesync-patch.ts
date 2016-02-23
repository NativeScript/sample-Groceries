import * as application from "application";


global.__onLiveSync = function() {
    if (application.android) {
        //Force an app restart even for page reload livesyncs
        const android = global.android;
        const System = global.java.lang.System;
        const Context = android.content.Context;
        const Intent = android.content.Intent;
        const PendingIntent = android.app.PendingIntent;
        const AlarmManager = android.app.AlarmManager;

        const context = application.android.context;
        const launchIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());

        launchIntent.addFlags(
            Intent.FLAG_ACTIVITY_CLEAR_TOP |
            Intent.FLAG_ACTIVITY_CLEAR_TASK |
            Intent.FLAG_ACTIVITY_NEW_TASK
        );
        const pendingIntent = PendingIntent.getActivity(context, 123456, launchIntent,
            PendingIntent.FLAG_CANCEL_CURRENT);

        const alarmManager = context.getSystemService(Context.ALARM_SERVICE);
        alarmManager.set(AlarmManager.RTC, System.currentTimeMillis(), pendingIntent);

        android.os.Process.killProcess(android.os.Process.myPid());
    } else {
        console.log("Single page update syncs not supported.");
    }
}
