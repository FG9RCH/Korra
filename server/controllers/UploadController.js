/**
 * Created by Frank on 3/10/2016.
 */
UploadController = function() {};

UploadController.prototype.upload = function(req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;

    fs.readFile(file.path, function (err, data) {
        // ...
        var newPath = __dirname + "/uploads/";
        fs.writeFile(newPath, data, function (err) {
            var filePath;
            return filePath = newPath + file.name;
        });
    });

    console.log(filePath);

};

module.exports = new UploadController();