var accesstoken = null;
var icustfId = null;
var ifrfId=null;
var itofTd=null;
var custname = null;
var ifrdate = null;
var itodate = null;
var itableId=null;
var tablerowscount=null;
var fDATE=null;
var tDATE=null;
var tablesrowcount=null;
var sClientId="mM7G^U8yOHG0C6aJZWzgxWvA^SBibk0Pnzg*rk1N5Bs=!n"; // need to be pass Client ID
var sClinetSecret="lRa0x1cLWjyk6qB*igV2pFo2Sq2QV0TKVMaazjGgi6k=!n"; // need to be pass Client Secret code
var sUserName="su"; // client CRM user Name
var sPassword="su"; // client CRM Password
var sCompanyCode="040"; // client Crm company
var Alrtmsg="Please fill required fields(Customer , From Date and To Date)"; // Alert Message for Required Fields
var Alertdtmsg="Data not found for these Combination(Customer, From Date and ToDate)";// Alert Message  for Data not found
var ipaddress="172.16.0.14:9595";
var clTestCrmEditView = new function () {
		 // Generate Access Token
		 
		this.getTokenThroughAPI=function(){
				
		debugger;
		var url="http://"+ipaddress+"/crmservices/rest/oauth/authorize?grant_type=password&client_id="+sClientId+"&client_secret="+sClinetSecret+"&username="+sUserName+"&password="+sPassword+"&companycode="+sCompanyCode;
		$.ajax({
			type: "GET",
			contentType:"application/json",
			url:url,
			success: function (sObj) {
				accesstoken=sObj.accessToken;
				centra.crmapi.getEditView().getFieldValue(clTestCrmEditView.fcbgetcustname, icustfId, 1);
			}
		});
	};
	// Get Customer Name
	 this.fcbgetcustname = function (onjrs5) {
        debugger;
        custname = onjrs5['data'];        
		centra.crmapi.getEditView().getFieldValue(clTestCrmEditView.fcbgetfromdate, ifrfId, 1);
		debugger;
    };
	//Get From Date
	this.fcbgetfromdate = function (onjrs6) {
        debugger;
        ifrdate = onjrs6['data'];
		centra.crmapi.getEditView().getFieldValue(clTestCrmEditView.fcbgettodate, itofTd, 1);
		debugger;
    }; 
		// Get To Date
	 this.fcbgettodate = function (onjrs7) {
        debugger;
       itodate = onjrs7['data']; 
	   centra.crmapi.getEditView().getTableRowCount(clTestCrmEditView.getTableRowCount,itableId,1);
	   
	   debugger;
    };
	//Table Rows count
	this.getTableRowCount=function(onjrs8){
		tablerowscount=onjrs8['data'];
		GetWayBillData();
		
		debugger;
	};
	this.Alertmsg=function(onjrs9){
		Alrtmsg;
	};
	this.Alertdtmsg=function(onjrs10){
		Alertdtmsg;
	}
	
	
   // Get Way Bill Data
    function GetWayBillData() {
	
        debugger;
		 var fidate=ifrdate.split("/");
	    fDATE=fidate[2]+'-'+fidate[1]+'-'+fidate[0];
		var toidate=itodate.split("/");
	     tDATE=toidate[2]+'-'+toidate[1]+'-'+toidate[0];
		 if(custname=='' ||ifrdate==''||itodate=='' ){
			 centra.crmapi.getEditView().AlertMsg(clTestCrmEditView.Alertmsg,Alrtmsg);

		 }
		 else{
        var data1 = { access_token: accesstoken };
        debugger;
        $.ajax({
            type: "GET",
			 url:"http://"+ipaddress+"/crmservices/rest/utils/v1.0/getQueryBasedMetaData?query=select iMasterId,iLocation,TruckCharges from vLn_vwb_list where CustomerName='"+custname+"' and DeparturefromHAMTerminal>='"+fDATE+"' and DeparturefromHAMTerminal<='"+tDATE+"'",
			contentType: "application/json",
            headers: {
                'access_token': accesstoken,
            },
            success: function (response) {
                debugger;
				
                var checkstatus = response['status'];	
                if (checkstatus == "0") {
					 centra.crmapi.getEditView().AlertMsg(clTestCrmEditView.Alertdtmsg,Alertdtmsg);
                    
	            
                        for (var k = tablerowscount; k >= 0; k--) 
						
						{
							if(k==0){
								centra.crmapi.getEditView().deleteBodyRow(WayBillDataTableCallback.CallBackDeleteGridRow, itableId, k);
							}
                            centra.crmapi.getEditView().deleteBodyRow(WayBillDataTableCallback.fcbBlank, itableId, k);
                        }
                   
                }
                else {
				
                    for (var k = tablerowscount; k >= 0; k--) 
					{
						if(k==0)
						centra.crmapi.getEditView().deleteBodyRow(WayBillDataTableCallback.CallBackDeleteGridRow, itableId, k);
						else
                        centra.crmapi.getEditView().deleteBodyRow(WayBillDataTableCallback.fcbBlank, itableId, k);
                   }
                    newArray = response['records'];
                    debugger;
                    var countarray = newArray['length'];
					
                    debugger;
                    for (var t = 0; t <= countarray; t++) {
                        var currentRow = t;                        
						var arr =newArray[t];
						var waybillname=arr['iMasterId'];
                        var waybilllocation =arr['iLocation'];
						var truckcharg=arr['TruckCharges']
                        var waybillQuantity = 1;
						var waybillstatus=2;
                        debugger;
                        var insrtarr = [[301898, waybillname], [301900, waybilllocation], [301901, waybillQuantity],[301902,truckcharg],[301908,waybillstatus]];

                        if (t == 0) {
                            centra.crmapi.getEditView().setRowWithValues(WayBillDataTableCallback.CallBackInsertGridRow, itableId, currentRow, insrtarr);
                        }
                        else {
                            centra.crmapi.getEditView().addRowWithValues(WayBillDataTableCallback.CallBackInsertGridRow, itableId, insrtarr);
							debugger;
                        }
                    }
					debugger;
			
                }
				
                $(this).next(':input').focus();

                debugger;
            },
            failure: function (response) {
            }
        });
	}
    }
};
// Deleting and Inserting WayBill Data in Gridview
var WayBillDataTableCallback = new function () {
	this.fcbBlank= function (onjrs) {
        debugger;
		
    };
    this.CallBackDeleteGridRow= function (onjrs) {
        debugger;
		userlogout();
    };
    this.CallBackInsertGridRow = function (onjrs) {
        debugger;
		
    };
    this.closeDialog = function () {
        centra.crmapi.getView().closeDialog();
    };
};
// Passing Required fields ID's and Calling Access Token
var Getwaybilldata = new function () {

    this.getwaybilldataofcustmoer = function () {
        debugger
       icustfId = 300683;
	   ifrfId=300694;
	   itofTd=300695;
       itableId=202;
       
        centra.crmapi.getEditView().getFieldValue(clTestCrmEditView.getTokenThroughAPI, icustfId, 1);
    };
};
// User Logout
this.userlogout=function(){
		debugger;
		var url=" http://"+ipaddress+"/crmservices/rest/oauth/logout";
		$.ajax({
			type: "POST",
			contentType:"application/json",
			url:url,
			success: function (sObj) {
				
			}
		});
};



