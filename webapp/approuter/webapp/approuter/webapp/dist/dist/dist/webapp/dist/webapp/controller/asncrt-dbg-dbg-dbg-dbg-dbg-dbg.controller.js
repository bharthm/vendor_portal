sap.ui.define([
    'zmmsubcontract/controller/BaseController','sap/m/MessageBox',
    'sap/m/MessageToast',
    'zmmsubcontract/model/formatter'

], function(BaseController,MessageBox,MessageToast,formatter) {
    
return BaseController.extend("zmmsubcontract.controller.asncrt",{     
    formatter: formatter,
  
    onInit:function(){        
        BaseController.prototype.onInit.apply(this);             
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.attachRoutePatternMatched(this._onObjectMatched,this);
        // this.oRouter.getRoute("subconASNcr").attachPatternMatched(this._onObjectMatched, this);                   
        this._localModel = this.getOwnerComponent().getModel("local");                                   
    },
    _onObjectMatched: function (oEvent) {
        // Perform the refresh logic here        
        this._refreshView();
    },
    _refreshView: function () {        
        debugger;
        var sModel = this.getOwnerComponent().getModel("selectedRecords");
        var oJsonModel = new sap.ui.model.json.JSONModel();
        oJsonModel.setData(sModel.oData);
        this.getView().setModel(oJsonModel,"regasnmodel");           
    },      
    onSaveASN: function(oEvent){
        
        oModel = this.getOwnerComponent().getModel("asncrt");
        this.getView().setModel(oModel); 
        var oPayload = this._localModel.getProperty("/asnData");  
        
        var oDatePicker = this.getView().byId("datePicker");
        var oDatePicker_ed = this.getView().byId("datePicker_ed");  
        var oDatePicker_lr = this.getView().byId("datePicker_lr");        

        // Get the selected date value from the DatePicker
        var sDate = oDatePicker.getValue(); // The date in "yyyy-MM-dd" format
        var sDate_de = oDatePicker_ed.getValue(); // The date in "yyyy-MM-dd" format
        var sDate_lr = oDatePicker_lr.getValue();

        oPayload.Dcdate = sDate;   
        oPayload.exDelvDate = sDate_de;   
        oPayload.Lrdate = sDate_lr;                
        
        var oTable = this.byId("idSelASN");
        var aItems = oTable.getItems();
        var aData = [];
         // Loop through table items
         debugger;
         aItems.forEach(function (oItem,index) {
            var oCells = oItem.getCells();
            debugger;
                index = index + 1
                if(index === 1){
                    oPayload.Exnum1 = oCells[0].mProperties.text, // Get value from first cell
                    oPayload.Menge1 = oCells[8].mProperties.value // Get value from second cell
                    oPayload.Werks = oCells[2].mProperties.text,
                    oPayload.Lifnr = oCells[3].mProperties.text,
                    // oPayload.Op_matnr = oCells[4].mProperties.text,
                    oPayload.Ebeln = oCells[10].mProperties.text,
                    oPayload.Ebelp = oCells[11].mProperties.text,    
                    oPayload.Matnr = oCells[4].mProperties.text                
                } else if (index === 2){
                    oPayload.Exnum2 = oCells[0].mProperties.text, // Get value from first cell
                    oPayload.Menge2 = oCells[8].mProperties.value // Get value from second cell
                } else if (index === 3){
                    oPayload.Exnum3 = oCells[0].mProperties.text, // Get value from first cell
                    oPayload.Menge3 = oCells[8].mProperties.value // Get value from second cell                    
                } else if (index === 4){
                    oPayload.Exnum4 = oCells[0].mProperties.text, // Get value from first cell
                    oPayload.Menge4 = oCells[8].mProperties.value // Get value from second cell
                } else {

                }                
                    
        });
        
        
        var oRadioButtonGroup = this.byId("idRadioGroup");
        var iSelectedIndex = oRadioButtonGroup.getSelectedIndex();
        if (iSelectedIndex === 0){
            oPayload.Jobstat = "C";
        } else if (iSelectedIndex === 1) {
            oPayload.Jobstat = "N";
        }
        
        debugger;
        aData.push(oPayload);
        debugger;
        var sBatchGroupId = "CreateBatchGroup";

        // Set the group as deferred so that all operations are collected until submitChanges is called
        oModel.setDeferredGroups([sBatchGroupId]);

        oModel.create("/ZET_ASN_CRTSet", oPayload, {
            success: function(){  
                debugger;                   
                MessageBox.success("Updated successfully",{
                    onClose: function() {
                        // Navigate to the selection page after the success message is closed
                        
                        this.oRouter.navTo("RegASN");
                        
                    }.bind(this)
                });
            }, 
            error: function(oErr){  
                debugger;                 
                console.log(oErr);
                MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
            }
        });
    },
    onChange: function(oEvent) {
        var bState = oEvent.getParameter("state");

        var oLab   = this.byId("idSecVend");        
        oLab.setVisible(bState);
        
        var oInput = this.byId("idLifn2");
        oInput.setVisible(bState);


    }      
});
});