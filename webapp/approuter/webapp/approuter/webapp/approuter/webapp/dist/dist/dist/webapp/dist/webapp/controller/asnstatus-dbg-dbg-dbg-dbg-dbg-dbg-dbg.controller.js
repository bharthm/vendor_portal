sap.ui.define([
    'zmmsubcontract/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    "sap/ui/core/date/UI5Date",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/PDFViewer"
], function (BaseController, MessageBox, MessageToast, JSONModel, Fragment, UI5Date, Filter, FilterOperator, PDFViewer) {
    'use strict';
    return BaseController.extend("zmmsubcontract.controller.asnstatus", {

        _data: {
            dtValue: UI5Date.getInstance(),
            dtPattern: undefined
        },
        onBeforeRendering: function () {
            debugger;
            var oModel = this.getView().getModel();
            oModel.refresh(true); // Force refresh from backend
        },        
        onInit: function () {
            BaseController.prototype.onInit.apply(this);
            this._localModel = this.getOwnerComponent().getModel("local");
            debugger;
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.attachRoutePatternMatched(this._onObjectMatched,this);
            // this.oRouter.getRoute("asnrep").attachPatternMatched(this._onObjectMatched,this);
                                                            
            //*****SETTING DATA TO MODEL AND MAPPING THE TABLE********* */

            this._readData();                     
     
            this.oRouter = this.getOwnerComponent().getRouter();

        },
        _readData: function() {
            var oModel = this.getOwnerComponent().getModel("asncrt");             
            oModel.refreshMetadata();
            oModel.refresh(true); // force a data refresh
            this.getView().byId("idasnStat").setModel(oModel);                        
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            this.getOwnerComponent().setModel(oModel, "defaultModel");
            oModel.read("/ZET_ASN_STATSet", {
                success: function(oData, response){                    
                    debugger;               
                    sap.ui.core.BusyIndicator.hide();                                                               
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(oData.results);
                    that.getView().setModel(oJsonModel, "asnrepModel");                                                             
                }, 
                error: function(oErr){   
                    debugger;                
                    console.log(oErr);
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });

        },
        onRowSelect: function () {
            alert("Triggered");
        },
        onSearchVendor: function (oEvent) {
            this._applySearchFilter("Lifnr", oEvent.getParameter("query"));
        },
        _onObjectMatched: function (oEvent) {
            // Perform the refresh logic here   
            debugger;         
            this._readData();      
        },
        _refreshView: function () {
         
            var oTable = this.byId("idRegASN"); 
            debugger;                      
            oTable.removeSelections(true);                              
        },     
        onSearchVendor: function (oEvent) {
            this._applySearchFilter("Lifnr", oEvent.getParameter("query"));
        },

        onSearchWerks: function (oEvent) {
            this._applySearchFilter("Werks", oEvent.getParameter("query"));
        },
        _applySearchFilter: function (sFieldName, sQuery) {
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter(sFieldName, FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            // update list binding
            var oTable = this.byId("idDetail");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },
        _selectedData: function (oEvent) {
            debugger;
            var listitem = oEvent.getParameter("listItem");
            var selectedRecords = listitem.getBindingContext("default");
            var vendor = selectedRecords.getProperty("Lifnr");
            var plant = selectedRecords.getProperty("Werks");
            var outputmat = selectedRecords.getProperty("Op_matnr");
            var inputmat = selectedRecords.getProperty("Ip_Matnr");
            var desc = selectedRecords.getProperty("Maktx");
            var uom = selectedRecords.getProperty("Meins");
            var balqty = selectedRecords.getProperty("Balqty");
            var bprme = selectedRecords.getProperty("bprme");
            var dano = selectedRecords.getProperty("Exnum");

            var dataobject = {};

            dataobject.vendor = vendor;
            dataobject.plant = plant;
            dataobject.outputmat = outputmat;
            dataobject.inputmat = inputmat;
            dataobject.desc = desc;
            dataobject.uom = uom;
            dataobject.balqty = balqty;
            dataobject.bprme = bprme;
            dataobject.dano = dano;

            // MessageBox.success("Selected Record" + " " + vendor + " " );

            var asnmodelobject = new sap.ui.model.json.JSONModel();

            asnmodelobject.setData(dataobject);

            this.getOwnerComponent().setModel(asnmodelobject, "ASNMODEL");


        },
        captureRecordEH: function (oEvent) {
            this._selectedData(oEvent);
            debugger;
            this.displayCrtAsnEH();

        },
        displayCrtAsnEH: function () {
            this.oRouter.navTo("subconASNcr");
        },

        onPreviewPDF: function (oEvent) {
            // Get the selected item
            var oSelectedItem = oEvent.getSource();

            // Get the binding context of the selected item
            var oContext = oSelectedItem.getBindingContext("default");

            // Get the data from the context
            var oData = oContext.getObject();
            //access pdf data using odata service
            var oView1 = this.getView();
            var oModel1 = oView1.getModel();
            var opdfViewer = new PDFViewer();
            this.getView().addDependent(opdfViewer);            
            var sServiceURL = oModel1.sServiceUrl;
            var sSourceR = "/zdapdfSet(Werks='" + oData.Werks + "',Lifnr='" + oData.Lifnr + "',Exnum='" + oData.Exnum + "',Exdat='" + oData.Exdat + "')/$value";
            var sSource = sServiceURL + "/zdapdfSet(Werks='" + oData.Werks + "',Lifnr='" + oData.Lifnr + "',Exnum='" + oData.Exnum + "',Exdat='" + oData.Exdat + "')/$value";
            
//********DO NOT TOUCH - IMPORTANT****************** */

            opdfViewer.setSource(sSource);
            opdfViewer.setTitle("DA PDF");            
            opdfViewer.open();

//********DO NOT TOUCH - IMPORTANT****************** */
          

        },
        onASN: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasnStat");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Asnno", FilterOperator.Contains, sQuery);                             

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);
        },
        onDCnumb: function(oEvent){            
                // Get the search query
                debugger;
                var sQuery = oEvent.getParameter("newValue");
                var oTable = this.byId("idasnStat");
                var oBinding = oTable.getBinding("items");
                var aFilters = [];
    
                if (sQuery && sQuery.length > 0) {
                    // Create filters for each field you want to search on
                    var oFilter1 = new Filter("Dcno", FilterOperator.Contains, sQuery);                                   
    
                    // Combine filters with OR
                    aFilters.push(new Filter({
                        filters: [oFilter1],
                        and: false
                    }));
                }
    
                // Apply the filter to the binding
                oBinding.filter(aFilters);           

        },
        onInv: function(oEvent){            
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasnStat");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Ebeln", FilterOperator.Contains, sQuery);                                   

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);           

    },
    onDCdate: function(oEvent){            
        // Get the search query
        debugger;
        var sQuery = oEvent.getParameter("newValue");
        var oTable = this.byId("idasnStat");
        var oBinding = oTable.getBinding("items");
        var aFilters = [];

        if (sQuery && sQuery.length > 0) {
            // Create filters for each field you want to search on
            var oFilter1 = new Filter("Dcdat", FilterOperator.Contains, sQuery);                                   

            // Combine filters with OR
            aFilters.push(new Filter({
                filters: [oFilter1],
                and: false
            }));
        }

        // Apply the filter to the binding
        oBinding.filter(aFilters);           

},
formatDate: function (sValue) {
    if (sValue) {
        var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy" });
        return oDateFormat.format(new Date(sValue));
    }
    return sValue;
},
formatZeroValue: function(value) {
    debugger;
    return value === null ? "" : value;
},
jobstatff: function(sValue){
    if (sValue) {
        return (sValue === 'C') ?  "/images/GTICK.jpg"  : "/images/RCROSS.jpg";
    }
    return sValue;

}                                            

        
    });
});