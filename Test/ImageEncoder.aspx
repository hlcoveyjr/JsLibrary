<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ImageEncoder.aspx.cs" Inherits="Test.ImageEncoder" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">
        function clearTextbox() {
            <%# txtOutput.ClientID %>.value = "";
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:FileUpload ID="fileUpload" runat="server" onclick="clearTextbox();"/>&nbsp;<asp:Button ID="btnSubmit" UseSubmitBehavior="true" Text="Go" runat="server" /><br />
            <asp:TextBox ID="txtOutput" TextMode="MultiLine" Columns="80" Rows="10" runat="server" Text="" />
        </div>
    </form>
</body>
</html>
