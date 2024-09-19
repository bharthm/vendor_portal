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
    return BaseController.extend("zmmsubcontract.controller.subconDA", {

        _data: {
            dtValue: UI5Date.getInstance(),
            dtPattern: undefined
        },
        onInit: function () {
            BaseController.prototype.onInit.apply(this);
            this._localModel = this.getOwnerComponent().getModel("local");
            
            // this.oRouter.attachRoutePatternMatched(this._onObjectMatched, this);
            this.oRouter.getRoute("subconDA").attachPatternMatched(this._onObjectMatched,this);
            this.oRouter = this.getOwnerComponent().getRouter();
            // var oModel = new JSONModel(this._data);   
            //*****SETTING DATA TO MODEL AND MAPPING THE TABLE********* */

            this._readData();

            // var oModel = this.getOwnerComponent().getModel();
            //     var sModel = this.getOwnerComponent().getModel("selectedRecords");
            //     if (!sModel) {
            //         sModel = new JSONModel([]);
            //         this.getOwnerComponent().setModel(sModel, "selectedRecords");
            //     }
            //     this.getView().byId("idDetail").setModel(oModel);
    
            //     var that = this;
            //     sap.ui.core.BusyIndicator.show(0);
            //     this.getOwnerComponent().setModel(oModel, "defaultModel");
            //     // Get data from the default entity set   
            //     debugger;                     
            //     oModel.read("/zet_da_listSet", {
            //         success: function (oData, response) {
            //             debugger;
            //             sap.ui.core.BusyIndicator.hide();
            //             var oJsonModel = new sap.ui.model.json.JSONModel();
            //             oJsonModel.setData(oData.results);
            //             that.getView().setModel(oJsonModel, "default");
            //         },
            //         error: function (oErr) {
            //             debugger;
            //             console.log(oErr);
            //             MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
            //         }
            //     });            




            

            //******************************************************** */

            this.oRouter = this.getOwnerComponent().getRouter();
        },
        _readData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var sModel = this.getOwnerComponent().getModel("selectedRecords");
            if (!sModel) {
                sModel = new JSONModel([]);
                this.getOwnerComponent().setModel(sModel, "selectedRecords");
            }
            this.getView().byId("idDetail").setModel(oModel);

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
        onRowSelect: function () {
            alert("Triggered");
        },
        onSearchVendor: function (oEvent) {
            this._applySearchFilter("Lifnr", oEvent.getParameter("query"));
        }, _onObjectMatched: function (oEvent) {
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
            debugger;
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
            var oTable = this.byId("idDetail");
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
            var oTable = this.byId("idDetail");
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
            var oTable = this.byId("idDetail");
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
            var oTable = this.byId("idDetail");
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