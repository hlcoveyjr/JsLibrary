using System;
using System.IO;
using System.Web;

namespace Test {

	public partial class ImageEncoder :System.Web.UI.Page {
    public string MsgBox
	{
        get { return txtOutput.Text; }
        set { txtOutput.Text = value; }
	}
		protected void Page_Load (object sender, EventArgs e) {
			if (IsPostBack) {
                try {
                    MsgBox = "";
                    if (Request.Files != null && Request.Files.Count > 0) {
                        var file = Request.Files[0];
                        if (file is null || file.ContentLength < 1) {
                            MsgBox = "Error: No file selected.";
                            return;
                        }
                        MsgBox = ImageToBase64(file);
                    }
                }
                catch(HttpException ex) {
                    if(ex.Message.Contains("Maximum request length exceeded")) {
                        MsgBox = "Error: The file is too large to read.";
                    } else {
                        MsgBox = "Error: An unknown error has occurred reading the file.";
                    }
                }
            }
        }
        public string ImageToBase64 (HttpPostedFile file) {
            var filename = file.FileName;
            byte[] fileData = null;
            var ext = Path.GetExtension(filename).Trim('.').Trim();
            if (string.IsNullOrEmpty(ext)) {
                ext = filename.Substring(filename.LastIndexOf('.') + 1);
            }
            using (var binaryReader = new BinaryReader(file.InputStream)) {
                try {
                    fileData = binaryReader.ReadBytes(Request.Files[0].ContentLength);
                    if(fileData.Length < 1) {
                        return $"Error: The file {filename} is empty.";
					}
                }
                catch (Exception ex) {
                    return $"Error: The file {filename} is corrupted or cannot be read.";
                    
                }
            }
            var _base64String = Convert.ToBase64String(fileData);
            return $"data:image/{ext};base64,{_base64String}";
        }
    }
}