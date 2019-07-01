sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, History, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.manageproducts.ManageProducts.controller.MoreDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.manageproducts.ManageProducts.view.MoreDetailss
		 */
		onInit: function () {
			this.getRouter().getRoute("moreDetails").attachPatternMatched(this._onMoreDetailsMatched, this);

			var oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "moreDetailsView");
		

		},

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function (oEvent) {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				var oView = this.getView(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.ProductID;
				this.getRouter().navTo("object", {
					objectId: sObjectId
				});
			}
		},

		_onMoreDetailsMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ProductSet", { //"ProductSet('AL_1')"   //.createKey - создать моделечитаемый путь до объекта в ней
					ProductID: sObjectId
				}); // ProductID - property in the model
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) { //путь до объекта в модели
			var oViewModel = this.getModel("moreDetailsView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath, //"ProductSet('AL_1')"
				events: {

					//change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				},
				parameters: {
					expand: "ToSupplier"
				}

			});
			
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf opensap.manageproducts.ManageProducts.view.MoreDetailss
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf opensap.manageproducts.ManageProducts.view.MoreDetailss
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf opensap.manageproducts.ManageProducts.view.MoreDetailss
		 */
		//	onExit: function() {
		//
		//	}

	});

});