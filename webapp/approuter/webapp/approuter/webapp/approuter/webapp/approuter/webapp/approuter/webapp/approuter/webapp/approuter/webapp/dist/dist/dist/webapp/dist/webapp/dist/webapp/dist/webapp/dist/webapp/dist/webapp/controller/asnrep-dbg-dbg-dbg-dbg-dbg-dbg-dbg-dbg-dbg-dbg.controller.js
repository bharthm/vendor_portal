sap.ui.define(["zmmsubcontract/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/core/date/UI5Date","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/PDFViewer"],function(e,t,r,n,a,i,o,s,d){"use strict";return e.extend("zmmsubcontract.controller.asnrep",{_data:{dtValue:i.getInstance(),dtPattern:undefined},onInit:function(){e.prototype.onInit.apply(this);this._localModel=this.getOwnerComponent().getModel("local");this.oRouter.getRoute("asnrep").attachPatternMatched(this._onObjectMatched,this);debugger;this.oRouter=this.getOwnerComponent().getRouter();var r=this.getOwnerComponent().getModel("asncrt");r.refreshMetadata();r.refresh(true);this.getView().byId("idasnRep").setModel(r);debugger;var n=this;sap.ui.core.BusyIndicator.show(0);this.getOwnerComponent().setModel(r,"defaultModel");r.read("/ZET_ASN_CRTSet",{success:function(e,t){debugger;sap.ui.core.BusyIndicator.hide();var r=new sap.ui.model.json.JSONModel;r.setData(e.results);n.getView().setModel(r,"asnrepModel")},error:function(e){debugger;console.log(e);t.error(JSON.parse(e.responseText).error.innererror.errordetails[0].message)}});this.oRouter=this.getOwnerComponent().getRouter()},onRowSelect:function(){alert("Triggered")},onSearchVendor:function(e){this._applySearchFilter("Lifnr",e.getParameter("query"))},_onObjectMatched:function(e){this._refreshView()},_refreshView:function(){var e=this.byId("idRegASN");debugger;e.removeSelections(true)},onSearchVendor:function(e){this._applySearchFilter("Lifnr",e.getParameter("query"))},onSearchWerks:function(e){this._applySearchFilter("Werks",e.getParameter("query"))},_applySearchFilter:function(e,t){var r=[];if(t&&t.length>0){var n=new o(e,s.Contains,t);r.push(n)}var a=this.byId("idDetail");var i=a.getBinding("items");i.filter(r,"Application")},_selectedData:function(e){debugger;var t=e.getParameter("listItem");var r=t.getBindingContext("default");var n=r.getProperty("Lifnr");var a=r.getProperty("Werks");var i=r.getProperty("Op_matnr");var o=r.getProperty("Ip_Matnr");var s=r.getProperty("Maktx");var d=r.getProperty("Meins");var u=r.getProperty("Balqty");var l=r.getProperty("bprme");var g=r.getProperty("Exnum");var p={};p.vendor=n;p.plant=a;p.outputmat=i;p.inputmat=o;p.desc=s;p.uom=d;p.balqty=u;p.bprme=l;p.dano=g;var c=new sap.ui.model.json.JSONModel;c.setData(p);this.getOwnerComponent().setModel(c,"ASNMODEL")},captureRecordEH:function(e){this._selectedData(e);debugger;this.displayCrtAsnEH()},displayCrtAsnEH:function(){this.oRouter.navTo("subconASNcr")},onPreviewPDF:function(e){var t=e.getSource();var r=t.getBindingContext("default");var n=r.getObject();var a=this.getView();var i=a.getModel();var o=new d;this.getView().addDependent(o);var s=i.sServiceUrl;var u="/zdapdfSet(Werks='"+n.Werks+"',Lifnr='"+n.Lifnr+"',Exnum='"+n.Exnum+"',Exdat='"+n.Exdat+"')/$value";var l=s+"/zdapdfSet(Werks='"+n.Werks+"',Lifnr='"+n.Lifnr+"',Exnum='"+n.Exnum+"',Exdat='"+n.Exdat+"')/$value";o.setSource(l);o.setTitle("DA PDF");o.open()},onASN:function(e){debugger;var t=e.getParameter("newValue");var r=this.byId("idasnRep");var n=r.getBinding("items");var a=[];if(t&&t.length>0){var i=new o("Asnno",s.Contains,t);a.push(new o({filters:[i],and:false}))}n.filter(a)},onPlant:function(e){debugger;var t=e.getParameter("newValue");var r=this.byId("idasnRep");var n=r.getBinding("items");var a=[];if(t&&t.length>0){var i=new o("Werks",s.Contains,t);a.push(new o({filters:[i],and:false}))}n.filter(a)},onInv:function(e){debugger;var t=e.getParameter("newValue");var r=this.byId("idasnRep");var n=r.getBinding("items");var a=[];if(t&&t.length>0){var i=new o("Ebeln",s.Contains,t);a.push(new o({filters:[i],and:false}))}n.filter(a)},onVendor:function(e){debugger;var t=e.getParameter("newValue");var r=this.byId("idasnRep");var n=r.getBinding("items");var a=[];if(t&&t.length>0){var i=new o("Lifnr",s.Contains,t);a.push(new o({filters:[i],and:false}))}n.filter(a)}})});
//# sourceMappingURL=asnrep-dbg-dbg-dbg-dbg-dbg-dbg-dbg-dbg-dbg-dbg.controller.js.map