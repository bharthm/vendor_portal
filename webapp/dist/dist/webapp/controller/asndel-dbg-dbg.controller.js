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
    return BaseController.extend("zmmsubcontract.controller.asndel", {

        _data: {
            dtValue: UI5Date.getInstance(),
            dtPattern: undefined
        },
        onInit: function () {
            BaseController.prototype.onInit.apply(this);
            this._localModel = this.getOwnerComponent().getModel("local");
            this.oRouter.attachRoutePatternMatched(this._onObjectMatched,this);
            // this.oRouter.getRoute("asnrep").attachPatternMatched(this._onObjectMatched, this);
            this.oRouter = this.getOwnerComponent().getRouter();

            //*****SETTING DATA TO MODEL AND MAPPING THE TABLE********* */

            this._readData();

            //******************************************************** */

            this.oRouter = this.getOwnerComponent().getRouter();
        },
        _readData: function () {

            var oModel = this.getOwnerComponent().getModel("asncrt");
            this.getView().byId("idasnDel").setModel(oModel);
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            this.getOwnerComponent().setModel(oModel, "defaultModel");

            oModel.read("/ZET_ASN_CRTSet", {
                success: function (oData, response) {
                    debugger;
                    sap.ui.core.BusyIndicator.hide();
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(oData.results);
                    that.getView().setModel(oJsonModel, "asnrepModel");
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
        formatDate: function (sValue) {
            if (sValue) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy" });
                return oDateFormat.format(new Date(sValue));
            }
            return sValue;
        },
        _selectedData: function (oEvent) {

            var oView = this.getView();
            var oTable = oView.byId("idasnDel");
            var aSelectedItems = oTable.getSelectedItems();
            var aSelectedData = [];

            if (aSelectedItems.length === 0) {
                debugger;
                MessageBox.error("Please Enter at least one Record");
                return; // No items selected
            }

            var aSelectedContexts = aSelectedItems.map(function (item) {
                return item.getBindingContext("asnrepModel");
            });

            // Extract the keys for the selected records
            var aSelectedKeys = aSelectedContexts.map(function (context) {
                return context.getProperty("Asnno");
            });
            aSelectedData.push(aSelectedKeys);
            this._deleteRecords(aSelectedData, aSelectedKeys, aSelectedContexts, aSelectedItems);


        },

        _deleteRecords: function (aKeys, aSKeys, aSCont, aSItems) {
            debugger;
            var oModel = this.getOwnerComponent().getModel("asncrt");
            var oView = this.getView();
            var oTable = oView.byId("idasnDel");
            var that = this;
            // Show a busy indicator
            sap.ui.core.BusyIndicator.show(0);
            // oModel.setUseBatch(true);

            oModel.setUseBatch(true);
            // Define a batch group ID
            var sBatchGroupId = "deleteBatchGroup";

            // Set the group as deferred so that all operations are collected until submitChanges is called
            oModel.setDeferredGroups([sBatchGroupId]);

            // Iterate over selected items and add delete operations to the batch
            debugger;
            var aPromises = aSKeys.map(function (oItem) {
                return new Promise(function (resolve, reject) {
                    var sPath = "/ZET_ASN_CRTSet('" + oItem + "')";
                    oModel.remove(sPath, {
                        groupId: sBatchGroupId, 
                        success: function () {
                            debugger;
                            resolve();
                        },
                        error: function (oError) {
                            debugger;
                            reject(oError);
                        }

                    });
                });
            });



            // Submit the batch requests
            oModel.submitChanges({
                groupId: sBatchGroupId,
                success: function (oData) {
                    Promise.all(aPromises)
                        .then(function () {
                            debugger;
                            that._readData();
                            sap.m.MessageToast.show("Records deleted successfully.");

                        })
                        .catch(function () {
                            debugger;
                            sap.m.MessageBox.error("Error deleting records.");
                        })
                        .finally(function () {
                            sap.ui.core.BusyIndicator.hide();
                        });

                },
                error: function (oError) {
                    sap.m.MessageBox.error("Error submitting changes: " + oError.message);
                    sap.ui.core.BusyIndicator.hide();
                }
            });


        },
        onDeleteASN: function (oEvent) {
            this._selectedData(oEvent);
        },


        onASN: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasn");
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
        onPlant: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasn");
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
        onInv: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasn");
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
        onVendor: function (oEvent) {
            // Get the search query
            debugger;
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idasn");
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