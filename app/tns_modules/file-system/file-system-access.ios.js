var utilsModule = require("utils/utils");
var textModule = require("text");
var FileSystemAccess = (function () {
    function FileSystemAccess() {
        this.keyModificationTime = "NSFileModificationDate";
        this.documentDir = 9;
        this.cachesDir = 13;
        this.userDomain = 1;
    }
    FileSystemAccess.prototype.getLastModified = function (path) {
        var fileManager = NSFileManager.defaultManager();
        var attributes = fileManager.attributesOfItemAtPathError(path);
        if (attributes) {
            return attributes.objectForKey(this.keyModificationTime);
        }
        else {
            return new Date();
        }
    };
    FileSystemAccess.prototype.getParent = function (path, onError) {
        try {
            var fileManager = NSFileManager.defaultManager();
            var nsString = NSString.alloc().initWithString(path);
            var parentPath = nsString.stringByDeletingLastPathComponent;
            var name = fileManager.displayNameAtPath(parentPath);
            return {
                path: parentPath.toString(),
                name: name
            };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    };
    FileSystemAccess.prototype.getFile = function (path, onError) {
        try {
            var fileManager = NSFileManager.defaultManager();
            var exists = fileManager.fileExistsAtPath(path);
            if (!exists) {
                if (!fileManager.createFileAtPathContentsAttributes(path, null, null)) {
                    if (onError) {
                        onError(new Error("Failed to create folder at path '" + path + "'"));
                    }
                    return undefined;
                }
            }
            var fileName = fileManager.displayNameAtPath(path);
            return {
                path: path,
                name: fileName,
                extension: this.getFileExtension(path)
            };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    };
    FileSystemAccess.prototype.getFolder = function (path, onError) {
        try {
            var fileManager = NSFileManager.defaultManager();
            var exists = this.folderExists(path);
            if (!exists) {
                try {
                    fileManager.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(path, true, null);
                }
                catch (ex) {
                    if (onError) {
                        onError(new Error("Failed to create folder at path '" + path + "': " + ex));
                    }
                    return undefined;
                }
            }
            var dirName = fileManager.displayNameAtPath(path);
            return {
                path: path,
                name: dirName
            };
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to create folder at path '" + path + "'"));
            }
            return undefined;
        }
    };
    FileSystemAccess.prototype.eachEntity = function (path, onEntity, onError) {
        if (!onEntity) {
            return;
        }
        this.enumEntities(path, onEntity, onError);
    };
    FileSystemAccess.prototype.getEntities = function (path, onSuccess, onError) {
        if (!onSuccess) {
            return;
        }
        var fileInfos = new Array();
        var onEntity = function (entity) {
            fileInfos.push(entity);
            return true;
        };
        var errorOccurred;
        var localError = function (error) {
            if (onError) {
                onError(error);
            }
            errorOccurred = true;
        };
        this.enumEntities(path, onEntity, localError);
        if (!errorOccurred) {
            onSuccess(fileInfos);
        }
    };
    FileSystemAccess.prototype.fileExists = function (path) {
        var fileManager = NSFileManager.defaultManager();
        return fileManager.fileExistsAtPath(path);
    };
    FileSystemAccess.prototype.folderExists = function (path) {
        var fileManager = NSFileManager.defaultManager();
        var outVal = new interop.Reference();
        var exists = fileManager.fileExistsAtPathIsDirectory(path, outVal);
        return exists && outVal.value > 0;
    };
    FileSystemAccess.prototype.concatPath = function (left, right) {
        var nsArray = utilsModule.ios.collections.jsArrayToNSArray([left, right]);
        var nsString = NSString.pathWithComponents(nsArray);
        return nsString.toString();
    };
    FileSystemAccess.prototype.deleteFile = function (path, onSuccess, onError) {
        this.deleteEntity(path, onSuccess, onError);
    };
    FileSystemAccess.prototype.deleteFolder = function (path, isKnown, onSuccess, onError) {
        if (isKnown) {
            if (onError) {
                onError({ message: "Cannot delete known folder." });
            }
            return;
        }
        this.deleteEntity(path, onSuccess, onError);
    };
    FileSystemAccess.prototype.emptyFolder = function (path, onSuccess, onError) {
        var fileManager = NSFileManager.defaultManager();
        var filesEnum = function (files) {
            var i;
            for (i = 0; i < files.length; i++) {
                try {
                    fileManager.removeItemAtPathError(files[i].path);
                }
                catch (ex) {
                    if (onError) {
                        onError(new Error("Failed to empty folder '" + path + "': " + ex));
                    }
                    return;
                }
            }
            if (onSuccess) {
                onSuccess();
            }
        };
        this.getEntities(path, filesEnum, onError);
    };
    FileSystemAccess.prototype.rename = function (path, newPath, onSuccess, onError) {
        var fileManager = NSFileManager.defaultManager();
        try {
            fileManager.moveItemAtPathToPathError(path, newPath);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to rename '" + path + "' to '" + newPath + "': " + ex));
            }
            return;
        }
        if (onSuccess) {
            onSuccess();
        }
    };
    FileSystemAccess.prototype.getDocumentsFolderPath = function () {
        return this.getKnownPath(this.documentDir);
    };
    FileSystemAccess.prototype.getTempFolderPath = function () {
        return this.getKnownPath(this.cachesDir);
    };
    FileSystemAccess.prototype.readText = function (path, onSuccess, onError, encoding) {
        var actualEncoding = encoding;
        if (!actualEncoding) {
            actualEncoding = textModule.encoding.UTF_8;
        }
        try {
            var nsString = NSString.stringWithContentsOfFileEncodingError(path, actualEncoding);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to read file at path '" + path + "': " + ex));
            }
            return;
        }
        if (onSuccess) {
            onSuccess(nsString.toString());
        }
    };
    FileSystemAccess.prototype.writeText = function (path, content, onSuccess, onError, encoding) {
        var nsString = NSString.alloc().initWithString(content);
        var actualEncoding = encoding;
        if (!actualEncoding) {
            actualEncoding = textModule.encoding.UTF_8;
        }
        try {
            nsString.writeToFileAtomicallyEncodingError(path, false, actualEncoding);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to write to file '" + path + "': " + ex));
            }
            return;
        }
        if (onSuccess) {
            onSuccess();
        }
    };
    FileSystemAccess.prototype.getKnownPath = function (folderType) {
        var fileManager = NSFileManager.defaultManager();
        var paths = fileManager.URLsForDirectoryInDomains(folderType, this.userDomain);
        var url = paths.objectAtIndex(0);
        return url.path;
    };
    FileSystemAccess.prototype.getFileExtension = function (path) {
        // TODO [For Panata]: The definitions currently specify "any" as a return value of this method
        //var nsString = Foundation.NSString.stringWithString(path);
        //var extension = nsString.pathExtension();
        var dotIndex = path.lastIndexOf(".");
        if (dotIndex && dotIndex >= 0 && dotIndex < path.length) {
            return path.substring(dotIndex);
        }
        return "";
    };
    FileSystemAccess.prototype.deleteEntity = function (path, onSuccess, onError) {
        var fileManager = NSFileManager.defaultManager();
        try {
            fileManager.removeItemAtPathError(path);
        }
        catch (ex) {
            if (onError) {
                onError(new Error("Failed to delete file at path '" + path + "': " + ex));
            }
        }
        if (onSuccess) {
            onSuccess();
        }
    };
    FileSystemAccess.prototype.enumEntities = function (path, callback, onError) {
        try {
            var fileManager = NSFileManager.defaultManager();
            try {
                var files = fileManager.contentsOfDirectoryAtPathError(path);
            }
            catch (ex) {
                if (onError) {
                    onError(new Error("Failed to enum files for folder '" + path + "': " + ex));
                }
                return;
            }
            var file;
            var i;
            var info;
            var retVal;
            for (i = 0; i < files.count; i++) {
                file = files.objectAtIndex(i);
                info = {
                    path: this.concatPath(path, file),
                    name: file
                };
                if (!this.folderExists(file)) {
                    info.extension = this.getFileExtension(info.path);
                }
                retVal = callback(info);
                if (retVal === false) {
                    break;
                }
            }
        }
        catch (ex) {
            if (onError) {
                onError(ex);
            }
        }
    };
    FileSystemAccess.prototype.getPathSeparator = function () {
        return "/";
    };
    FileSystemAccess.prototype.normalizePath = function (path) {
        var nsString = NSString.stringWithString(path);
        var normalized = nsString.stringByStandardizingPath;
        return normalized;
    };
    FileSystemAccess.prototype.joinPath = function (left, right) {
        var nsString = NSString.stringWithString(left);
        return nsString.stringByAppendingPathComponent(right);
    };
    FileSystemAccess.prototype.joinPaths = function (paths) {
        if (!paths || paths.length === 0) {
            return "";
        }
        var nsArray = NSMutableArray.alloc().initWithCapacity(paths.length);
        var i;
        for (i = 0; i < paths.length; i++) {
            nsArray.addObject(paths[i]);
        }
        var nsString = NSString.stringWithString(NSString.pathWithComponents(nsArray));
        return nsString.stringByStandardizingPath;
    };
    return FileSystemAccess;
})();
exports.FileSystemAccess = FileSystemAccess;
