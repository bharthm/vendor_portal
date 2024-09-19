sap.ui.define([
  'zmmsubcontract/controller/BaseController',
  "sap/ui/core/Popup",
  "sap/m/Popover",
  "sap/m/VBox",
  "sap/m/Label",
  "sap/m/Button",
  "sap/m/GenericTile",
  'sap/m/MessageBox'
], function (BaseController, Popup, Popover, VBox, Label, Button, GenericTile, MessageBox) {
  'use strict';
  return BaseController.extend("zmmsubcontract.controller.subcon", {

    onInit: function () {
      debugger;
      this._getUserDetail();            
      var eModel = this.getOwnerComponent().getModel("email");
      this.getOwnerComponent().setModel(eModel, "emailModel");
      sap.ui.core.BusyIndicator.show(0);
      debugger;
      eModel.read("/ZET_EMAILSet", {
        success: function (oData, response) {
          sap.ui.core.BusyIndicator.hide();
          var firstRecord = oData.results[0];
          debugger;
          var oJsonModel = new sap.ui.model.json.JSONModel(firstRecord);
          that.getView().setModel(oJsonModel, "email");
        },
        error: function (oErr) {
          debugger;
          sap.ui.core.BusyIndicator.hide();
          console.log(oErr);
          MessageBox.error(JSON.parse(oErr.responseText).error.innererror.errordetails[0].message);
        }
      });

      //******carasoul auto************ */
      var oCarousel = this.byId("idCars2");
      setInterval(function () {
        var aPages = oCarousel.getPages();
        var sActivePageId = oCarousel.getActivePage();
        var iCurrentPageIndex = -1;
        aPages.forEach(function (oPage, index) {
          if (oPage.getId() === sActivePageId) {
            iCurrentPageIndex = index;
          }
        });
        // Calculate the next page index
        var iNextPageIndex = (iCurrentPageIndex + 1) % aPages.length;

        // Navigate to the next page                  
        oCarousel.setActivePage(aPages[iNextPageIndex].getId());
      }, 4000); //

      //**************************************************** */

      BaseController.prototype.onInit.apply(this);
      this.oRouter = this.getOwnerComponent().getRouter();
      var oPopover = this.getView().byId("popover");
      this._bInsidePopover = true;
      this._localModel = this.getOwnerComponent().getModel("local");
      this._homeModel = this.getOwnerComponent().getModel("home");
      this._SupSerModel = this.getOwnerComponent().getModel("SupSer");
      this._SubSerModel = this.getOwnerComponent().getModel("SubSer");
      this._VenOnbModel = this.getOwnerComponent().getModel("VenOnb");

      this._qisModel = this.getOwnerComponent().getModel("qis");
      this._TrnVenModel = this.getOwnerComponent().getModel("TrnVen");
      this._CrDrModel = this.getOwnerComponent().getModel("CrDr");
      this._ncrModel = this.getOwnerComponent().getModel("ncr");
      this._SupRatModel = this.getOwnerComponent().getModel("SupRat");
      this._circModel = this.getOwnerComponent().getModel("circ");
      this._dashModel = this.getOwnerComponent().getModel("dash");


      var oIconTabBar = this.getView().byId("idIconTabBar");
      var that = this;
      oIconTabBar.getItems().forEach(function (oItem) {
        oItem.addEventDelegate({
          onmouseover: function (oEvent) {
            that.onIconTabFilterHover(oEvent, oItem);
          },
          onmouseout: function (oEvent) {
            that.onIconTabFilterOut(oEvent, oItem);
          }
        });
      });

      oPopover.attachAfterOpen(function () {
        var oPopoverDomRef = oPopover.getDomRef();
        if (oPopoverDomRef) {
          oPopoverDomRef.addEventListener('mouseover', this.onPopoverMouseOver.bind(this));
          oPopoverDomRef.addEventListener('mouseout', this.onPopoverMouseOut.bind(this));
        }
      }.bind(this));
    },
    _getUserDetail: function () {
      $.ajax({
        url: "/nodeapp/api/your-endpoint", // Your Node.js backend endpoint
        method: "GET",
        // headers: {
        //     "Authorization": "Bearer " + sap.ushell.Container.getService("UserInfo").getIdToken()
        // },
        success: function(data) {
          debugger;
            console.log("Data received from Node.js backend: ", data);
        },
        error: function(err) {
          debugger;
            console.error("Error accessing Node.js backend: ", err);
        }
    });      
    },
    onTabClick: function (oEvent, oItem) {
      if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
        debugger;
        var oIconTabBar = this.getView().byId("idIconTabBar");


        var oModel = this._localModel;
        var oHomeModel = this._homeModel;
        var oSubSerModel = this._SubSerModel;
        var oSupSerModel = this._SupSerModel;
        var oVenOnbModel = this._VenOnbModel;

        var oqisModel = this._qisModel;
        var oTrnVenModel = this._TrnVenModel;
        var oCrDrModel = this._CrDrModel;
        var oncrModel = this._ncrModel;
        var oSupRatModel = this._SupRatModel;
        var ocircModel = this._circModel;
        var odashModel = this._dashModel;

        var oPopover = this.getView().byId("popover");
        var that = this;
        switch (oIconTabBar.mProperties.selectedKey) {
          case "id_Home":
            that.getView().byId("idList").setModel(oHomeModel, "localData");
            // var oPopover = this.getView().byId("popover");                  
            break;
          case "id_SupSer":
            that.getView().byId("idList").setModel(oSupSerModel, "localData");
            break;
          case "id_SubSer":
            that.getView().byId("idList").setModel(oSubSerModel, "localData");
            break;
          case "id_VenOnb":
            that.getView().byId("idList").setModel(oVenOnbModel, "localData");
            break;
          case "id_Qis":
            that.getView().byId("idList").setModel(oqisModel, "localData");
            break;
          case "id_trVen":
            that.getView().byId("idList").setModel(oTrnVenModel, "localData");
            break;
          case "id_CrDbNt":
            that.getView().byId("idList").setModel(oCrDrModel, "localData");
            break;
          case "id_Ncr":
            that.getView().byId("idList").setModel(oncrModel, "localData");
            break;
          case "id_SupRt":
            that.getView().byId("idList").setModel(oSupRatModel, "localData");
            break;
          case "id_Cir":
            that.getView().byId("idList").setModel(ocircModel, "localData");
            break;
          case "id_Dash":
            that.getView().byId("idList").setModel(odashModel, "localData");
            break;
          default:
            oList.setModel(null);
        }

        var aVisibleItems = [];
        oIconTabBar.getItems().forEach(function (oItem) {

          var $itemDomRef = oItem.getDomRef();

          // Check if the tab has a DOM reference, meaning it's visible on the screen
          if ($itemDomRef && $itemDomRef.offsetParent !== null) {
            aVisibleItems.push(oItem);
          }
        });

        var selectedtab = oIconTabBar.mProperties.selectedKey;

        var oSelectedItem = aVisibleItems.find(function (oItem) {
          return oItem.getKey() === selectedtab;
        });

        if (oSelectedItem) {
          oIconTabBar.setSelectedKey(selectedtab);
          this._bInsidePopover = true;
          oPopover.openBy(oSelectedItem);
        }
      }
    },
    onIconTabFilterHover: function (oEvent, oItem) {
      var oIconTabBar = this.getView().byId("idIconTabBar");


      var oModel = this._localModel;
      var oHomeModel = this._homeModel;
      var oSubSerModel = this._SubSerModel;
      var oSupSerModel = this._SupSerModel;
      var oVenOnbModel = this._VenOnbModel;

      var oqisModel = this._qisModel;
      var oTrnVenModel = this._TrnVenModel;
      var oCrDrModel = this._CrDrModel;
      var oncrModel = this._ncrModel;
      var oSupRatModel = this._SupRatModel;
      var ocircModel = this._circModel;
      var odashModel = this._dashModel;

      var oPopover = this.getView().byId("popover");
      var that = this;
      switch (oItem.mProperties.key) {
        case "id_Home":
          that.getView().byId("idList").setModel(oHomeModel, "localData");
          // var oPopover = this.getView().byId("popover");                  
          break;
        case "id_SupSer":
          that.getView().byId("idList").setModel(oSupSerModel, "localData");
          break;
        case "id_SubSer":
          that.getView().byId("idList").setModel(oSubSerModel, "localData");
          break;
        case "id_VenOnb":
          that.getView().byId("idList").setModel(oVenOnbModel, "localData");
          break;
        case "id_Qis":
          that.getView().byId("idList").setModel(oqisModel, "localData");
          break;
        case "id_trVen":
          that.getView().byId("idList").setModel(oTrnVenModel, "localData");
          break;
        case "id_CrDbNt":
          that.getView().byId("idList").setModel(oCrDrModel, "localData");
          break;
        case "id_Ncr":
          that.getView().byId("idList").setModel(oncrModel, "localData");
          break;
        case "id_SupRt":
          that.getView().byId("idList").setModel(oSupRatModel, "localData");
          break;
        case "id_Cir":
          that.getView().byId("idList").setModel(ocircModel, "localData");
          break;
        case "id_Dash":
          that.getView().byId("idList").setModel(odashModel, "localData");
          break;
        default:
          oList.setModel(null);
      }

      var aVisibleItems = [];
      oIconTabBar.getItems().forEach(function (oItem) {

        var $itemDomRef = oItem.getDomRef();

        // Check if the tab has a DOM reference, meaning it's visible on the screen
        if ($itemDomRef && $itemDomRef.offsetParent !== null) {
          aVisibleItems.push(oItem);
        }
      });

      var selectedtab = oItem.mProperties.key;
      var oSelectedItem = aVisibleItems.find(function (oItem) {
        return oItem.getKey() === selectedtab;
      });

      if (oSelectedItem) {
        oIconTabBar.setSelectedKey(oItem.getKey());
        this._bInsidePopover = true;
        oPopover.openBy(oSelectedItem);
      }
    },

    onIconTabFilterOut: function (oEvent, oItem) {
      var oPopover = this.getView().byId("popover");
      this._bInsidePopover = false;
      setTimeout(function () {
        if (!this._bInsidePopover) {
          oPopover.close();
        }
      }.bind(this), 1000);
    },

    onTabSelect: function (oEvent) {
      // Handle tab select event if needed
    },
    onPopoverMouseOver: function (oEvent) {
      this._bInsidePopover = true;
    },
    onPopoverMouseOut: function () {
      var oPopover = this.getView().byId("popover");
      this._bInsidePopover = false;
      // Close the popover after a slight delay to allow for the mouse to move back into the tile
      setTimeout(function () {
        if (!this._bInsidePopover) {
          oPopover.close();
        }
      }.bind(this), 100);
    },
    onSubconDA: function () {
      this.oRouter.navTo("subconDA");
    },
    OnCreateASN: function () {
      this.oRouter.navTo("subconASNcr");
    },
    onPress: function (oEvent) {
      var selectedRecord = oEvent.oSource.mProperties.title

      if (selectedRecord === 'DA schedule') {
        this.oRouter.navTo("subconDA");
      } else if (selectedRecord === 'ASN Create') {
        this.oRouter.navTo("RegASN");
      }
      else if (selectedRecord === 'ASN Report') {
        this.oRouter.navTo("asnrep");
      }
      else if (selectedRecord === 'ASN Status') {
        this.oRouter.navTo("asnstat");
      }
      else if (selectedRecord === 'ASN Delete') {
        this.oRouter.navTo("asndel");
      }
      else if (selectedRecord === 'ASN Print') {
        this.oRouter.navTo("asnprint");
      }
      else {

      }
    },
    onAboutUsPress: function () {
      window.open("https://sundram.com/about-us.php", '_blank');

    },
    onContactsPress: function () {
      window.open("https://sundram.com/contact-us.php", '_blank');
    }
  });
});