sap.ui.define([
	"./BaseController",
	"opensap/manageproducts/ManageProducts/model/formatter",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, formatter, History, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("opensap.manageproducts.ManageProducts.controller.ProductDetails", {

		formatter: formatter,

		onInit: function () {
			this.byId("categoryLabel").setVisible(false);
			this.byId("category").setVisible(false);
		},
		onShowMoreDetails: function (oEvent) {
			var oSource = oEvent.getSource();
			this.getRouter().navTo("moreDetails", {
				objectId: oSource.getBindingContext().getProperty("ProductID")
			});
		},
		onDeleteObject: function (oEvent) {
			var oSource = oEvent.getSource();
			this._oContext = oSource.getBindingContext();
			var sURL = this._oContext.getPath();
			var that = this;
			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash(),
				oResourceBundle = this.getResourceBundle();
			new Promise(function (resolve) {
					that.getModel().remove(sURL);
					if (sPreviousHash !== undefined) {
						// The history contains a previous entry
						history.go(-1);
					} else {
						// Otherwise we go backwards with a forward history
						that.getRouter().navTo("worklist", {}, true);
					}
					resolve();
				}

			).then(function () {
				
				MessageToast.show(oResourceBundle.getText("deleteSuccess"), {
					closeOnBrowserNavigation: false
				});
			}, function (oError) {
				MessageBox.error(oError.message);
			});
		}

	});

});