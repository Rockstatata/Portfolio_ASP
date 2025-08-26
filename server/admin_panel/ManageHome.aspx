<%@ Page Title="Home" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageHome.aspx.cs" Inherits="admin_panel.ManageHome" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div>
        <asp:GridView ID="gvHomeSections" runat="server" AutoGenerateColumns="False"
            OnRowEditing="gvHomeSections_RowEditing" OnRowUpdating="gvHomeSections_RowUpdating"
            OnRowCancelingEdit="gvHomeSections_RowCancelingEdit" DataKeyNames="Id">
            <Columns>
                <asp:BoundField DataField="SectionName" HeaderText="Section" ReadOnly="true" />
                <asp:TemplateField HeaderText="Content">
                    <ItemTemplate>
                        <asp:Label ID="lblContent" runat="server" Text='<%# Eval("Content") %>'></asp:Label>
                    </ItemTemplate>
                    <EditItemTemplate>
                        <asp:TextBox ID="txtContent" runat="server" Text='<%# Eval("Content") %>'
                            TextMode="MultiLine" Rows="3" Width="100%"></asp:TextBox>
                    </EditItemTemplate>
                </asp:TemplateField>
                <asp:CheckBoxField DataField="IsActive" HeaderText="Active" />
                <asp:CommandField ShowEditButton="True" />
            </Columns>
        </asp:GridView>
    </div>
</asp:Content>
