"use strict";
var application_settings_1 = require("application-settings");
var connectivity_1 = require("connectivity");
var Config = (function () {
    function Config() {
    }
    Config.handleOnlineOffline = function () {
        if (connectivity_1.getConnectionType() == connectivity_1.connectionType.none) {
        }
        else {
        }
    };
    Config.setupConnectionMonitoring = function () {
        //Config.handleOnlineOffline();
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
    Config.apiUrl = "https://firegroceries-904d0.firebaseio.com";
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBbUMsc0JBQXNCLENBQUMsQ0FBQTtBQUMxRCw2QkFBaUUsY0FBYyxDQUFDLENBQUE7QUFFaEY7SUFBQTtJQTRCQSxDQUFDO0lBekJnQiwwQkFBbUIsR0FBbEM7UUFDRSxFQUFFLENBQUMsQ0FBQyxnQ0FBaUIsRUFBRSxJQUFJLDZCQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVqRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7UUFHUixDQUFDO0lBQ0gsQ0FBQztJQUNNLGdDQUF5QixHQUFoQztRQUNFLCtCQUErQjtRQUMvQiw4QkFBZSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxzQkFBVyxlQUFLO2FBQWhCO1lBQ0UsTUFBTSxDQUFDLGdDQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsQ0FBQzthQUNELFVBQWlCLFFBQWdCO1lBQy9CLGdDQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLENBQUM7OztPQUhBO0lBSU0scUJBQWMsR0FBckI7UUFDRSxNQUFNLENBQUMsQ0FBQyxDQUFDLGdDQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNNLHNCQUFlLEdBQXRCO1FBQ0UsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQTFCTSxhQUFNLEdBQUcsNENBQTRDLENBQUM7SUEyQi9ELGFBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDO0FBNUJZLGNBQU0sU0E0QmxCLENBQUEifQ==