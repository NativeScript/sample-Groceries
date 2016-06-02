"use strict";
var application_settings_1 = require("application-settings");
var connectivity_1 = require("connectivity");
var Everlive = require("../shared/everlive.all.min");
var Config = (function () {
    function Config() {
    }
    Config.handleOnlineOffline = function () {
        if (connectivity_1.getConnectionType() == connectivity_1.connectionType.none) {
            Config.el.offline();
        }
        else {
            Config.el.online();
            Config.el.sync();
        }
    };
    Config.setupConnectionMonitoring = function () {
        Config.handleOnlineOffline();
        connectivity_1.startMonitoring(Config.handleOnlineOffline);
    };
    Object.defineProperty(Config, "token", {
        get: function () {
            return application_settings_1.getString("token");
        },
        set: function (theToken) {
            application_settings_1.setString("token", theToken);
        },
        enumerable: true,
        configurable: true
    });
    Config.hasActiveToken = function () {
        return !!application_settings_1.getString("token");
    };
    Config.invalidateToken = function () {
        Config.token = "";
    };
    Config.el = new Everlive({
        apiKey: "gwfrtxi1lwt4jcqk",
        offlineStorage: true
    });
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBbUMsc0JBQXNCLENBQUMsQ0FBQTtBQUMxRCw2QkFBaUUsY0FBYyxDQUFDLENBQUE7QUFDaEYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFFckQ7SUFBQTtJQStCQSxDQUFDO0lBekJnQiwwQkFBbUIsR0FBbEM7UUFDRSxFQUFFLENBQUMsQ0FBQyxnQ0FBaUIsRUFBRSxJQUFJLDZCQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQUNNLGdDQUF5QixHQUFoQztRQUNFLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzdCLDhCQUFlLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHNCQUFXLGVBQUs7YUFBaEI7WUFDRSxNQUFNLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO2FBQ0QsVUFBaUIsUUFBZ0I7WUFDL0IsZ0NBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQzs7O09BSEE7SUFJTSxxQkFBYyxHQUFyQjtRQUNFLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ00sc0JBQWUsR0FBdEI7UUFDRSxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBN0JNLFNBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUN2QixNQUFNLEVBQUUsa0JBQWtCO1FBQzFCLGNBQWMsRUFBRSxJQUFJO0tBQ3JCLENBQUMsQ0FBQztJQTJCTCxhQUFDO0FBQUQsQ0FBQyxBQS9CRCxJQStCQztBQS9CWSxjQUFNLFNBK0JsQixDQUFBIn0=