import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import {scroll} from '@polymer/app-layout/helpers/helpers.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @customElement
 * @polymer
 */
class MainApp extends PolymerElement {
    ready() {
        super.ready();
    }
    static get properties() {
        return {
        	page: {
                type: String,
                reflectToAttribute: true,
                observer: '_pageChanged'
            },
	  	    allStocks:{
	  	        type: Array,
	  	        value:[]
	  	    }
        }
    }

	static get observers() {
        return ['_routeChanged(routeData.page)']
    }

	_routeChanged(page) {
        this.page = page;
    }
	
	_pageChanged(currentPage, oldPage) {
		switch (currentPage) {
            case 'reviewbkp':
                import('../stocksbkp/reviewbkp-orders.js');
                break;
            case 'buybkp':
            	import('../stocksbkp/placebkp-order.js');
                break;
            case 'stocksbkp':
				import('../stocksbkp/stocksbkp-app.js');
                break;
            case 'dayanalyticsbkp':
            	import('../analyticsbkp/analyticsbkp.js');
                break;
            default:
                this.page = 'review';
        }
    }

	_getStocksURL(){
	    console.log(config.baseUrl + "/stocks");
		return config.baseUrl + "/stocks";
	}
	
	getAllStocks(){
		this.$.ajax.generateRequest();
	}
	
	handleStocksResponse(event) {
		if(event.detail.response.length>0){
			this.allStocks = event.detail.response;
			this.set('route.allStocks',this.allStocks)
		}
	}
	
    _toggleDrawer() {
        var drawer = this.shadowRoot.querySelector('app-drawer');
        drawer.toggle();
    }
    static get template() {
        return html`
        <style>
                :host {
					--paper-font-common-base: {
						font-family: Raleway, sans-serif;
					};
                }
                iron-image {
                    width: 153px;
                    height: 153px;
                    margin-left: 20%;
                }
                paper-item {
					height: 54px;
                }
                paper-item > a {
					width: 100%;
					height: 100%;
					line-height: 54px;
					text-align: center;
					text-decoration: none;
					color: black;
                }
                paper-icon-button {
                    color: white;
                }
				app-toolbar {
						background-color: #ff6200;
						color: black;
				} 
					paper-progress {
						display: block;
						width: 100%;
						--paper-progress-active-color: rgba(255, 255, 255, 0.5);
						--paper-progress-container-color: transparent;
					}
					app-header {
						@apply(--layout-fixed-top);
						color: #ff6200;
						--app-header-background-rear-layer: {
							background-color: green;
						};
                    }
                    paper-icon-button + [main-title] {
                        margin-left: 18%;
                        font-family:var(--lumo-font-family);
                        color:white;
                    }
		</style>
        <app-location route="{{route}}"></app-location>
        <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
        <app-toolbar>
            <paper-icon-button on-click="_toggleDrawer" icon="menu"></paper-icon-button>
             <div main-title>ING Trader</div>
        </app-toolbar>
			<app-drawer-layout has-scrolling-region responsive-width="940px">
                <app-drawer swipe-open slot="drawer">
                    <app-header-layout has-scrolling-region>
                        <iron-image sizing="cover" preload src="../images/ING Logo.png"></iron-image>
                        <paper-listbox>
						     <paper-item on-tap="getAllStocks">
                                  <a href="#/stocks"> All Stocks </a>
                            </paper-item>
        					<paper-item on-tap="getAllStocks">
                                  <a href="#/review"> Review Orders </a>
                            </paper-item>
                            <paper-item>
                                   <a href="/reviewbkp" name="name">Review Orders</a>
                            </paper-item>
                            <paper-item>
                                    <a href="/buybkp" name="name">Place Order</a>
                            </paper-item>
                            <paper-item>
                                    <a href="/dayanalyticsbkp" name="name">Day History</a>
                            </paper-item>
                        </paper-listbox>
                    </<app-header-layout>        
                </app-drawer>
                <iron-pages selected="[[page]]" attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
                      <reviewbkp-order name="reviewbkp" route="{{route}}"></reviewbkp-order> 
                      <placebkp-order name="buybkp" route="{{route}}"></placebkp-order> 
                      <stocksbkp-app name="stocksbkp" allStocks="[[allStocks]]" route="{{route}}"></stocksbkp-app> 
                      <analyticsbkp-app name="dayanalyticsbkp"></analyticsbkp-app>
                </iron-pages>
            </app-drawer-layout>
            <iron-ajax
            	auto
            	id="ajax"
                url="[[_getStocksURL()]]"
            	method="[[method]]"
            	content-type="application/json"
            	on-response="handleStocksResponse"
            	on-error="handleError"
            	handle-as="json"></iron-ajax>
       `;
    }
}
window.customElements.define('mainbkp-app', MainApp);