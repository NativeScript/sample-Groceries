var callback;
var EditableDataSource;

if (typeof NSObject != "undefined") {
    EditableDataSource = (function(_super) {
        __extends(EditableDataSource, _super);
        function EditableDataSource() {
            _super.apply(this, arguments);
        }
        EditableDataSource.initWithOwnerBaseDataSource = function(owner, baseDataSource) {
            var ds = this.new();
            ds._owner = owner;
            ds._baseDataSource = baseDataSource;
            return ds;
        };
        EditableDataSource.prototype.tableViewNumberOfRowsInSection = function(tableView, section) {
            return this._baseDataSource.tableViewNumberOfRowsInSection(tableView, section);
        };
        EditableDataSource.prototype.tableViewCellForRowAtIndexPath = function(tableView, indexPath) {
            return this._baseDataSource.tableViewCellForRowAtIndexPath(tableView, indexPath);
        };
        EditableDataSource.prototype.tableViewCanEditRowAtIndexPath = function() {
            return true;
        };
        EditableDataSource.prototype.tableViewCommitEditingStyleForRowAtIndexPath = function (tableView, editingStyle, indexPath) {
            if (editingStyle === UITableViewCellEditingStyle.UITableViewCellEditingStyleDelete) {
                callback(indexPath.row);
            }
        };
        EditableDataSource.ObjCProtocols = [UITableViewDataSource];
        return EditableDataSource;
    })(NSObject);
}

module.exports = {
    enable: function(listView, deleteCallback) {
        callback = deleteCallback;
        var myDataSource = EditableDataSource.initWithOwnerBaseDataSource(this, listView.ios.dataSource);
        listView.ios.dataSource = myDataSource;
        listView.__keepDataSourceReference = myDataSource;
    }
};
