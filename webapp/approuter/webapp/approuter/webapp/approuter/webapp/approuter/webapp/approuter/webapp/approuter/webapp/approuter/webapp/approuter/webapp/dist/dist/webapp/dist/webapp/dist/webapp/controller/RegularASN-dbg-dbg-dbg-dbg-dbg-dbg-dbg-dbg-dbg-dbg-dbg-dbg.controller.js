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
    return BaseController.extend("zmmsubcontract.controller.RegularASN", {

        _data: {
            dtValue: UI5Date.getInstance(),
            dtPattern: undefined
        },
        onInit: function () {
            BaseController.prototype.onInit.apply(this);
            this._localModel = this.getOwnerComponent().getModel("local");
            debugger;

            
            // this.oRouter.attachRoutePatternMatched(this._onObjectMatched,this);
            this.oRouter.getRoute("RegASN").attachPatternMatched(this._onObjectMatched, this);
            this.oRouter = this.getOwnerComponent().getRouter();

            //*****SETTING DATA TO MODEL AND MAPPING THE TABLE********* */

                this._readData();

            //******************************************************** */
            this.oRouter = this.getOwnerComponent().getRouter();
        },
        _readData: function() {
            var oModel = this.getOwnerComponent().getModel();
            var sModel = this.getOwnerComponent().getModel("selectedRecords");
            if (!sModel) {
                sModel = new JSONModel([]);
                this.getOwnerComponent().setModel(sModel, "selectedRecords");
            }
            this.getView().byId("idRegASN").setModel(oModel);                        
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            this.getOwnerComponent().setModel(oModel, "defaultModel");
            // Get data from the default entity set            
            oModel.read("/zet_da_listSet", {
                success: function (oData, response) {
                    debugger;
                    sap.ui.core.BusyIndicator.hide();
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(oData.results);
                    that.getView().setModel(oJsonModel, "default");
                },
                error: function (oErr) {
                    debugger;
                    console.log(oErr);
                    MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
                }
            });
        },
        _onObjectMatched: function (oEvent) {
            // Perform the refresh logic here
            this._refreshView();
        },
        _refreshView: function () {

            // var oTable = this.byId("idRegASN");
            // debugger;
            // oTable.removeSelections(true);
            // oTable.unbindItems();     
            this._readData();                

        },

        onSearchVendor: function (oEvent) {
            this._applySearchFilter("Lifnr", oEvent.getParameter("query"));
        },

        onSearchWerks: function (oEvent) {
            this._applySearchFilter("Werks", oEvent.getParameter("query"));
        },
        _applySearchFilter: function (sFieldName, sQuery) {
            var aFilters = [];
            debugger;
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

            var sModel = this.getOwnerComponent().getModel("selectedRecords");
            var oView = this.getView();
            var oTable = oView.byId("idRegASN");
            var aSelectedItems = oTable.getSelectedItems();
            var aSelectedData = [];
            
            if (aSelectedItems.length === 0) {
                debugger;
                MessageBox.error("Please Enter at least one Record");
                return; // No items selected
            }

            // Extract PO and PO Line Item values from the first item
            var oFirstContext = aSelectedItems[0].getBindingContext("default");
            var sFirstPO = oFirstContext.getProperty("Ebeln"); // Replace "PO" with your actual property name
            var sFirstPOLineItem = oFirstContext.getProperty("Ebelp"); // Replace "POLineItem" with your actual property name


            //*********check the po and line item of the selected records************** */    
            debugger;        
            aSelectedItems.forEach(function (oItem, index) {
                index = index + 1;                
                if (index > 4) {
                    // Trigger error message if index is greater than 4
                    MessageBox.error("You have selected more than 4 items. Please select up to 4 items only.");
                    return; // Exit the loop early to prevent further processing
                }
            });

            var bAllSame =  aSelectedItems.every(function (oItem) {            
                var oContext = oItem.getBindingContext("default");
                if (oContext) {
                    var sPO = oContext.getProperty("Ebeln");
                    var sPOLineItem = oContext.getProperty("Ebelp");
                    return sPO === sFirstPO && sPOLineItem === sFirstPOLineItem;
                }
                return false;
            });

            if (!bAllSame) {
                // Trigger error message if PO or PO Line Item values differ
                MessageBox.error("Please select records with the same PO and PO Line Item.");
                return;
            }

            // aSelectedData.push(oItem.getBindingContext().getObject());

            //******************************************************************************** */  


            aSelectedItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext("default");
                if (oContext) {
                    aSelectedData.push(oContext.getObject());
                } else {
                    console.log("No binding context found for item:", oItem);
                }

                // aSelectedData.push(oItem.getBindingContext().getObject());
            });

            sap.ui.getCore().setModel(sModel, "selectedItemsModel");
            sModel.setData(aSelectedData);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("subconASNcr");

            //***************FOR DISPLAYING HEADER********************* */
            debugger;
            var dataobject = {};

            dataobject.vendor = sModel.oData[0].Lifnr;
            dataobject.plant = sModel.oData[0].Werks;
            dataobject.outputmat = sModel.oData[0].Op_matnr;
            dataobject.Ebeln = sModel.oData[0].Ebeln;
            dataobject.Ebelp = sModel.oData[0].Ebelp;

            // MessageBox.success("Selected Record" + " " + vendor + " " );

            var asnmodelobject = new sap.ui.model.json.JSONModel();

            asnmodelobject.setData(dataobject);

            this.getOwnerComponent().setModel(asnmodelobject, "ASNMODEL");


            //********FOR DISPLAYING HEADER*****/

        },
        onCreateASN: function (oEvent) {
            this._selectedData(oEvent).bind(this);
            this._displayCrtAsnEH();

        },
        _displayCrtAsnEH: function () {
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
        onMat: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idRegASN");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Op_matnr", FilterOperator.Contains, sQuery);
                var oFilter2 = new Filter("Ip_Matnr", FilterOperator.Contains, sQuery);

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1, oFilter2],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);
        },
        onPlant: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idRegASN");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Werks", FilterOperator.Contains, sQuery);

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);

        },
        onDA: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idRegASN");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Exnum", FilterOperator.Contains, sQuery);

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);

        },
        onVendor: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idRegASN");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                // Create filters for each field you want to search on
                var oFilter1 = new Filter("Lifnr", FilterOperator.Contains, sQuery);

                // Combine filters with OR
                aFilters.push(new Filter({
                    filters: [oFilter1],
                    and: false
                }));
            }

            // Apply the filter to the binding
            oBinding.filter(aFilters);

        }

    });
});