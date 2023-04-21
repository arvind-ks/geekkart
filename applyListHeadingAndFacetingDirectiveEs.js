ccubeApp.directive('applyListHeadingAndFacetingDirectiveEs', ['services','ubaService','talentpoolServices','$route','$filter','$http','$activityIndicator','$modal','$window', '$location','$q','$timeout','$sce','growl','$rootScope',	function (services,ubaService, talentpoolServices,$route,$filter,$http,$activityIndicator,$modal,$window, $location,$q, $timeout,$sce,growl,$rootScope) {
	return { 	
			scope: {
					remainingBlockedCount:'=',
					blockedApplicationsLimit:'=',
					blockedApplicationsCount:'=',
					applies: '=',	
					appliesPf: '=',
					commonFilterStatusAndSource: '=',
					commonFilterDate: '=',
					dateFieldsInfo:'=',
					commonFilterModifiedDateApply: '=',
					applyListAndHeadingHtml: '@',
					recruiterApplyListCallback: '&',
					dashBoardApplyListCri: '=',
					applyListFilterCri: '=',
					appliesListCount: '=',
					validateBulk: '&',
					validateResumePresent:'&',
					validateBulkEmailsent:'&',
					applicantActionPerformed:'&',
					loadShortlistToAnotherJobData:'&',
					isTpOrGtp:'=',
					inviteToApplyForJob:'&',
					downloadApplies:'&',
					enableApplieslist:'&',
					allRights:'=',
					hasMoreApplies:'=',
					getMoreGlobalProfiles:'&',
					getNextApplies:'&',
					facetConfig:'=',
					isJob:'=',
					sessionStorageVar:'=',
					tabScope:'=',
					loadDirectiveObj:'=',
					job:'='
				},				
				templateUrl: function(element, attrs) {			         
					return attrs.applyListAndHeadingHtml;
				},			
				link: function (scope, element, attrs,ngModel,growlProvider,alertify) {
					scope.advancedSearchTextMaxLimit = false;
					scope.totalAppliesListCount = scope.appliesListCount;
					scope.viewProfile = localStorage.getItem('viewProfile');
					if(scope.sessionStorageVar=="talentPoolApplyListCri"){
						localStorage.setItem('viewProfile',false);
					}
					scope.checkModalPopUp = null;
					scope.setModalForPopUp = function(field){
						scope.checkModalPopUp = field;
					}
					scope.setSummaryPopUpDetails = function(id) {
						scope.applyPF = {};
						for (var i = 0; i < scope.appliesPf.length; i++) {
							if (id == scope.appliesPf[i].jobApplication.id) {
								scope.applyPF = scope.appliesPf[i];
							}
						}
					}
					scope.isRelevantSkillsSectionExpanded = {};
					scope.setExpandAllForAll = function(id) {
						var applieslist = JSON.parse(localStorage.getItem('applyPFDataList')); 
						if(applieslist && applieslist!=null && applieslist!=undefined){
							for (var i = 0; i < applieslist.length; i++) {
								scope.isRelevantSkillsSectionExpanded[applieslist[i].id] = true;
							}
						}
						
					}

					scope.TPMatchingApplies = scope.$root.TPMatchingApplies;
					scope.getCompanyCmnConfiguration = JSON.parse(localStorage.getItem('manageAPIGetConfigurationData')).companyCommonConfiguration;
					scope.subSourceNotToDisplay = [];
					if(scope.getCompanyCmnConfiguration.subSourceNotToDisplay){
						scope.subSourceNotToDisplay = scope.getCompanyCmnConfiguration.subSourceNotToDisplay.split(",");
					}
					scope.selectedFilterTags = [];
					scope.applyActionObj = {};
					scope.applicationsArr = [];
					scope.allRightList = [];
					scope.NOACTION_BUTTON = "NoActionButton";
					scope.EDIT_VIEW_ALL_JOBS_RIGHT = "Edit/view all Jobs";
					scope.EDIT_VIEW_ALL_APPLIES_RIGHT = "Edit/view all Applies";
					scope.CREATE_JOBS_RIGHT = "Create jobs";
					scope.sortByFieldOptions = ["Last Action Date", "Skill Match %", "Designation Match %", 
					"Applicant Name", "Applied Date", "Status of Candidate"];
					scope.isAscending = false;
					scope.isExpandAll = true;
					scope.isCollapseAll = false;
					scope.setExpandAllForAll(); 					
					scope.sortByFieldOptionsMap = { 
					"modifiedDate": "Last Action Date",
					"Candidate.arsScores.scoreList.skillScore": "Skill Match %",
					"Candidate.arsScores.scoreList.titleScore": "Designation Match %",
					"firstName": "Applicant Name",
					"dateApplied": "Applied Date",
					"currentStatus": "Status of Candidate"};
					scope.sortByFieldDefault = "Last Action Date";
					scope.MANAGE_APPLIES_OF_ASSIGNED_JOBS_RIGHT = "Manage applies of assigned jobs";
					scope.enableJobSpecificFilter = localStorage.getItem('enableJobSpecificFilter');
					scope.pagePath = window.location.href;
					if((scope.pagePath.indexOf("/job-applications") != -1) || (scope.pagePath.indexOf("/job-applications-new") != -1)) {
						if(scope.TPMatchingApplies) {
							// Talentpool matching applies
							scope.pageType = scope.sessionStorageVar + 'Tags';
							scope.pageScope = "talentpool";
						} else {
							// Job Applications
							scope.pageType = scope.sessionStorageVar + 'Tags';
							scope.pageScope = scope.tabScope;
						}
					} else if(scope.pagePath.indexOf("/talent-pool-search") != -1){
						// Talentpool
						scope.pageType = scope.sessionStorageVar + 'Tags';
						scope.pageScope = "talentpool";
						 
					} else if(scope.pagePath.indexOf("/appliesListView") != -1){
						// Dashboard drilldown applies
						scope.pageType = scope.sessionStorageVar + 'Tags';
						scope.pageScope = scope.tabScope;
					} else if(scope.pagePath.indexOf("/approvals") != -1){
						scope.pageType = scope.sessionStorageVar.replace('Approval','Tags');
						scope.pageScope = "Approvals";					
					} else {
						//Any other page
						//Do nothing
					}
					
					
				       scope.isSortedfirstName = false;
					   scope.isSortedcurrentStatus = false;
					   scope.isSortedsource = false;
					   scope.isSortedDateColumn = true;				
					
					   scope.isAscendingfirstName = true;
					   scope.isAscendingcurrentStatus = true;
					   scope.isAscendingsource = true;
					   scope.isAscendingDateColumn = true;
					   scope.isAscendingFilterScore = true;
					   scope.allRightList = JSON.parse(JSON.stringify(scope.allRights));
					   //scope.allRightList = JSON.parse(JSON.stringify(scope.hmAccessFieldList));
					   scope.createSortToggle = function(sortingFieldName,isAscending){
						   if(sortingFieldName == 'firstName')
						   {
							   	scope.isAscendingfirstName = !isAscending;
							   	scope.isAscendingcurrentStatus = true;
							   	scope.isAscendingsource = true;
							   	scope.isAscendingDateColumn = true;
								scope.isAscendingFilterScore = true;
								scope.isSortedfirstName = true;
					            scope.isSortedcurrentStatus = false;
					            scope.isSortedsource = false;
					            scope.isSortedDateColumn = false;
						  
						   }else if(sortingFieldName == 'applicantName')
						   {
							   	scope.isAscendingfirstName = !isAscending;
							   	scope.isAscendingcurrentStatus = true;
							   	scope.isAscendingsource = true;
							   	scope.isAscendingDateColumn = true;
								scope.isAscendingFilterScore = true;
								scope.isSortedfirstName = true;
					            scope.isSortedcurrentStatus = false;
					            scope.isSortedsource = false;
					            scope.isSortedDateColumn = false;
								
						  
						   }else if(sortingFieldName == 'currentStatus')
						   {
							  	scope.isAscendingfirstName = true;
							  	scope.isAscendingcurrentStatus = !isAscending;
							  	scope.isAscendingsource = true;
							  	scope.isAscendingDateColumn = true;
								   scope.isAscendingFilterScore = true;
					            scope.isSortedfirstName = false;
					            scope.isSortedcurrentStatus = true;
					            scope.isSortedsource = false;
					            scope.isSortedDateColumn = false;
						   }else if(sortingFieldName == 'source')
						   {
							   	scope.isAscendingfirstName = true;
							   	scope.isAscendingcurrentStatus = true;
							   	scope.isAscendingsource = !isAscending;
							   	scope.isAscendingDateColumn = true;
								   scope.isAscendingFilterScore = true;
								scope.isSortedfirstName = false;
					            scope.isSortedcurrentStatus = false;
					            scope.isSortedsource = true;
					            scope.isSortedDateColumn = false;

						   } else if(sortingFieldName == scope.dateFieldsInfo.dateColumnFieldName) {
							   	scope.isAscendingfirstName = true;
							   	scope.isAscendingcurrentStatus = true;
							   	scope.isAscendingsource = true;
							   	scope.isAscendingDateColumn = !isAscending;
					            scope.isSortedfirstName = false;
					            scope.isSortedcurrentStatus = false;
					            scope.isSortedsource = false;
					            scope.isSortedDateColumn = true;
						   } else if(sortingFieldName == 'filterScore'){
								scope.isAscendingfirstName = true;
							   	scope.isAscendingcurrentStatus = true;
							   	scope.isAscendingsource = true;
							   	scope.isAscendingDateColumn = true;
							    scope.isAscendingFilterScore = !isAscending;

						   }
					   };
					   scope.toggleSort = function(sortingFieldName,isAscending)
					   {  
					   		var isAscendingTp = "Low to High";
					   		if(!isAscending){
					   			isAscendingTp = "High to Low";
					   		}
					   	   updateUBAaction('ja_sort_match_'+sortingFieldName+"_"+isAscendingTp);
						   scope.sort.active = sortingFieldName; 
						   scope.sort.descending = isAscending;
						   scope.createSortToggle(sortingFieldName,isAscending);
						   scope.appliesToBeSort = {"name":sortingFieldName,"isAscending":isAscending};
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesToBeSort,selectedCall:"sort"});
					   };

					   scope.toggleSortForNewApplies = function(isAscending)
					   {  
							var sortingFieldName = "";
							for(var key in scope.sortByFieldOptionsMap){
								if(scope.sortByFieldOptionsMap[key] == scope.sortByFieldDefault){
									sortingFieldName = key;
									break;
								}
							}
					   		var isAscendingTp = "Low to High";
					   		if(!isAscending){
					   			isAscendingTp = "High to Low";
					   		}
					   	   updateUBAaction('ja_sort_match_'+sortingFieldName+"_"+isAscendingTp);
						   scope.sort.active = sortingFieldName; 
						   scope.sort.descending = isAscending;
						   scope.createSortToggle(sortingFieldName,isAscending);
						   scope.appliesToBeSort = {"name":sortingFieldName,"isAscending":isAscending};
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesToBeSort,selectedCall:"sort"});
					   };

					   scope.toggleSwitchForNewApplies = function(isAscending){
						scope.isAscending = isAscending;
						scope.toggleSortForNewApplies(scope.isAscending);
					   }

					   scope.expandAll = function(){
						scope.isExpandAll = true;
						scope.isCollapseAll = false;
						var applieslist = JSON.parse(localStorage.getItem('applyPFDataList')); 
							for (var i = 0; i < applieslist.length; i++) {
								scope.isRelevantSkillsSectionExpanded[applieslist[i].id] = true;
							}
					   }

					   scope.collapseAll = function(){
						scope.isCollapseAll = true;
						scope.isExpandAll = false;
						scope.isRelevantSkillsSectionExpanded = {};
					   }

					   scope.expandRelevantSkillsForCandidate = function(id){
							scope.isRelevantSkillsSectionExpanded[id] = true ;
							
					   }

					   scope.collapseRelevantSkillsForCandidate = function(id){
						scope.isRelevantSkillsSectionExpanded[id] = false ;
				   }
		
					  scope.getSortedFieldTitle = function(isSorted,isAscending)
					   {  
						   if(isSorted == true && isAscending == true){
							   return 'Sort by '+$rootScope.dateFieldDisplayNameGlobal+' Descending';
						   }else if(isSorted == true && isAscending == false){
							  return 'Sort by '+$rootScope.dateFieldDisplayNameGlobal+' Ascending';
						   }else{
							  return 'Sort by '+$rootScope.dateFieldDisplayNameGlobal;
							}
					   };
		
					   
					   
		                scope.getIcon = function(column) {
	                     
		            		var sort = scope.sort;
		            		if (sort.active == column) {
		              			return sort.descending
		                		? 'glyphicon-chevron-up'
		                		: 'glyphicon-chevron-down';
		            		}
		            
		            		return 'fa fa-sort';
	        		  };

						scope.changeSorting = function(column) {

					        var sort = scope.sort;
					
					        if (sort.active == column) {
					            sort.descending = !sort.descending;
								
					        } else {
					            sort.active = column;
					            sort.descending = false;
					        }
							scope.createSortToggle(column,sort.descending);
						    scope.appliesToBeSort = {"name":column,"isAscending":sort.descending};
						    scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesToBeSort,selectedCall:"sort"});
    					 };

						scope.getSelectedFieldForMatch = function(fieldName, selectedFieldName) {
							scope.selectedFieldForMatch = selectedFieldName;
							scope.selectedFieldForMatchName = fieldName; 
						}
						
						scope.getSelectedFieldForStatus = function(fieldName,selectedFieldName) {
							scope.selectedFieldForStatus = selectedFieldName; 
							scope.selectedFieldForStatusName = fieldName; 
						}
						
							scope.sessionId=localStorage.getItem('sessionId');


					   
					   scope.selectedFilter = {};
					   scope.currentFrameForFilter = {};
					   scope.currentFrameForFilterJobApp = {};
					   scope.appliesFilterCriJobApp = {};
					   scope.commonFilterStatusAndSourceJobApp = {};
					   scope.appliesFilterCriJobApp.allFieldSelected = {};
					   scope.appliesFilterCriJobApp = scope.applyListFilterCri;
					   scope.createFilterCriteria =function(){
						   scope.appliesFilterCriJobApp.allFieldSelected = {};
							scope.commonFilterDateApplyJobApp = angular.copy(scope.commonFilterDate);
							if(!scope.isJob){
								//For Manage Job Applies and Dashboard Applies.
								//Storage is localStorage.
								var manageJobApplyListCri = JSON.parse(localStorage.getItem(scope.sessionStorageVar)); 
							}
							else {
								var manageJobApplyListCri = JSON.parse(sessionStorage.getItem(scope.sessionStorageVar)); 
							}
							if(manageJobApplyListCri.appliesFilter == undefined){
							     scope.appliesFilterCri = {};
							 }else{
								scope.appliesFilterCri = manageJobApplyListCri.appliesFilter;
							 }
							
							if(manageJobApplyListCri.appliesFilter) {
								if(manageJobApplyListCri.appliesFilter.allFieldSelected) {
									scope.appliesFilterCriJobApp.allFieldSelected = manageJobApplyListCri.appliesFilter.allFieldSelected;
								}
							}
							var topMatches = {};
							topMatches.displayName = "Top Matches";
							topMatches.isVisible = true;
							topMatches.type = "topMatches";
							
							if(scope.facetConfig.showTopMatchesFacetFilter && scope.facetConfig.enableNaukriPrivateDBSearch && !(scope.facetConfig.jobApplication[scope.facetConfig.jobApplication.length-1].displayName === topMatches.displayName)){
								scope.facetConfig.jobApplication.push(topMatches);
						   }
							
						   for(var i=0;scope.facetConfig.hasOwnProperty('jobApplication') && i<scope.facetConfig.jobApplication.length;i++){ 
							   scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
							   scope.commonFilterStatusAndSourceJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
							   if(!scope.appliesFilterCriJobApp.allFieldSelected[scope.facetConfig.jobApplication[i].displayName]) {
								   scope.appliesFilterCriJobApp.allFieldSelected[scope.facetConfig.jobApplication[i].displayName] = [];
							   }
						   }
						   

					   }
					   
					   scope.setAdvancedExpInputModel = function() {
						   if(scope.appliesFilterCri.experienceAdvancedSearch && scope.appliesFilterCri.experienceAdvancedSearch[0]) {
								if(scope.appliesFilterCri.experienceAdvancedSearch[0]["from"]) {
									scope.input.minExperience = scope.appliesFilterCri.experienceAdvancedSearch[0]["from"];
								}
								if(scope.appliesFilterCri.experienceAdvancedSearch[0]["to"]) {
									scope.input.maxExperience = scope.appliesFilterCri.experienceAdvancedSearch[0]["to"];
								}
							}
							
							if(scope.input.minExperience == undefined || scope.input.minExperience == -1) {
								scope.input.minExperience = '';
							}
							
							if(scope.input.maxExperience == undefined || scope.input.maxExperience == 100) {
								scope.input.maxExperience = ''; 
							}
					   }
					   if(scope.pagePath.indexOf("/job-applications") != -1) {
						   services.getFitmentApprovalStatus(scope.sessionId).then(function(data) { 
								if(data.data !=null && data.data.responseCode==200){
									scope.approvalStatus=data.data.reponseObject; 
									if(scope.approvalStatus) {
										scope.approvalStatusList=scope.approvalStatus.split(',');
									}
								}
							   });
					   }
					   

					   scope.currentFrameForFilter['dateColumn'] = [];
					   scope.currentFrameForFilter['dateFacet'] = [];
					   scope.currentFrameForFilter['match'] = [];
					   scope.currentFrameForFilter['noticePeriod'] = [];
					   scope.currentFrameForFilter['topMatches'] = [];
					   
					   scope.selectedFieldForMatch = "Candidate.arsScores.scoreList.skillScore";
					   scope.selectedFieldForMatchName = "";
					   scope.selectedFieldForStatus = "currentStatus";
					   scope.selectedFieldForStatusName = "";
					   //Text input model object
					   scope.input = {};
					   scope.appliesFilterCri = {};
					   scope.selectedAll = {};
					   scope.selectedAll['status'] = false;
					   scope.selectedAll['source'] = false;
					   scope.selectedAll['By Current Status'] = false;
					   scope.selectedAll['By Source'] = false;
					   scope.selectedAll['By Match'] = false;
					   scope.selectedAllDateColumn = false;
					   scope.selectedAllMatchApplied = false;
					   var indexOfDateColumn = 0;
					   
					   scope.appliesFilterCri = scope.applyListFilterCri;

					   if(!scope.appliesFilterCri.freeTextApplicantName) {
						   scope.appliesFilterCri['freeTextApplicantName'] = "";
					   }
					   if(!scope.appliesFilterCri.freeTextJobTitleAndCode) {
						   scope.appliesFilterCri['freeTextJobTitleAndCode'] = "";
					   }
					   if(!scope.appliesFilterCri.anyOfTheseWords) {
						   scope.appliesFilterCri['anyOfTheseWords'] = "";
					   } else {
						   scope.input.anyOfTheseWords = scope.appliesFilterCri.anyOfTheseWords;
					   }
					   
					   if(!scope.appliesFilterCri.anyOfTheseWordsExactMatch) {
						   scope.appliesFilterCri['anyOfTheseWordsExactMatch'] = "";
					   } else {
						   scope.input.anyOfTheseWordsExactMatch = scope.appliesFilterCri.anyOfTheseWordsExactMatch;
					   }
					   
					   if(!scope.appliesFilterCri.allOfTheseWords) {
						   scope.appliesFilterCri['allOfTheseWords'] = "";
					   } else {
						   scope.input.allOfTheseWords = scope.appliesFilterCri.allOfTheseWords;
					   }
					   
					   if(!scope.appliesFilterCri.exactPhrase) {
						   scope.appliesFilterCri['exactPhrase'] = "";
					   } else {
						   scope.input.exactPhrase = scope.appliesFilterCri.exactPhrase;
					   }
					   
					   if(!scope.appliesFilterCri.noneOfTheseWords) {
						   scope.appliesFilterCri['noneOfTheseWords'] = "";
					   } else {
						   scope.input.noneOfTheseWords = scope.appliesFilterCri.noneOfTheseWords;
					   }
					   
					   if(!scope.appliesFilterCri.locationAdvancedSearch) {
						   scope.appliesFilterCri['locationAdvancedSearch'] = "";
					   } else {
						   scope.input.locationAdvancedSearch = scope.appliesFilterCri.locationAdvancedSearch;
					   }
					   
					   if(!scope.appliesFilterCri.andWithin) {
						   scope.appliesFilterCri['andWithin'] = "";
					   } else {
						   scope.input.andWithin = scope.appliesFilterCri.andWithin;
					   }
					   
					   if(!scope.appliesFilterCri.experienceAdvancedSearch) {
						   scope.appliesFilterCri.experienceAdvancedSearch = [{'from':null,'to':null}];
					   } else {
						   scope.setAdvancedExpInputModel();
					   }
					   
					   if(!scope.appliesFilterCri.ctcType) {
						   scope.appliesFilterCri['ctcType'] = "INR";
					   }
					   if(!scope.appliesFilterCri.withOrWithoutResume) {
						   scope.appliesFilterCri['withOrWithoutResume'] = [0,1];
					   }
					   if(!scope.appliesFilterCri.match) {
						   scope.appliesFilterCri['match'] = [];
					   }
					   if(!scope.appliesFilterCri.experience) {
						   scope.appliesFilterCri['experience'] = [];
					   }
					   if(!scope.appliesFilterCri.currentCtc) {
						   scope.appliesFilterCri['currentCtc'] = [];
					   }
					   if(!scope.appliesFilterCri.dateFacet) {
						   scope.appliesFilterCri['dateFacet'] = [];
					   }
					   if(!scope.appliesFilterCri.dateColumn) {
						   scope.appliesFilterCri['dateColumn'] = [];
					   }
						if(!scope.appliesFilterCri.dateFrom && !scope.appliesFilterCri.dateTo ) {
						   scope.appliesFilterCri.dateFrom ="";
						   scope.appliesFilterCri.dateTo ="";
					   }
						if(!scope.appliesFilterCri.noticePeriod) {
						   scope.appliesFilterCri['noticePeriod'] = [];
					   }
					    if(!scope.appliesFilterCri.filterSelect) {
						   scope.appliesFilterCri.filterSelect = false;
					   }
					   if(!scope.appliesFilterCri.customDate) {
						  scope.appliesFilterCri.customDate = false;
					   }
					    if(!scope.appliesFilterCri.inValidMessage) {
						   scope.appliesFilterCri.inValidMessage = "";
					   }
					   scope.IsShowVendorName = localStorage.getItem('IsShowVendorName');
					   
					   if(sessionStorage.getItem(scope.pageType)){
						   scope.selectedFilterTags = JSON.parse(sessionStorage.getItem(scope.pageType)); 
					   }	   
					   
					   // Get data from storage saved on view application page.
					   if(!scope.isJob){
							// For Manage Job Applies and Dashboard Applies.
							// Storage is localStorage.
						   scope.appliesFilterCri = JSON.parse(localStorage.getItem(scope.sessionStorageVar)); 
						}
						else {
							scope.appliesFilterCri = JSON.parse(sessionStorage.getItem(scope.sessionStorageVar)); 	   
						}
					   
					   scope.setBooleanForAdvancedSearchText = function(){
						   scope.advancedSearchTextMaxLimit = false;
						   scope.advancedSearchLengthMaxLimit = false;

						   if(scope.input.anyOfTheseWords != undefined) {
							   if(scope.input.anyOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;
							   }
							   var searchTextArr = scope.input.anyOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.anyOfTheseWordsExactMatch != undefined) {
							   if(scope.input.anyOfTheseWordsExactMatch.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;
							   }
							   var searchTextArr = scope.input.anyOfTheseWordsExactMatch.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.allOfTheseWords != undefined) {
							   if(scope.input.allOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.allOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.exactPhrase != undefined) {
							   if(scope.input.exactPhrase.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.exactPhrase.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.noneOfTheseWords != undefined) {
							   if(scope.input.noneOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.noneOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.andWithin != undefined) {
							   if(scope.input.andWithin.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.andWithin.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
						   }
						   if(scope.input.locationAdvancedSearch != undefined) {
							   if(scope.input.locationAdvancedSearch.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.locationAdvancedSearch.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
				       	   }
					   }
					   scope.getCustomDateFilter = function(date,fromDate,toDate){
						  // var appliesFilterCri = JSON.parse(localStorage.getItem(scope.sessionStorageVar));
						   var fromCount = 0;
						   scope.appliesFilterCriJobApp.dateFrom = fromDate ? fromDate :null;
						   var date1 = new Date(scope.appliesFilterCriJobApp.dateFrom);
						   scope.appliesFilterCriJobApp.dateTo = toDate ? toDate :null;
						   var date2 = new Date(scope.appliesFilterCriJobApp.dateTo);
						   scope.appliesFilterCriJobApp.inValidMessage ="";
						   if(scope.appliesFilterCriJobApp.dateFrom != null || scope.appliesFilterCriJobApp.dateTo != null){
								scope.appliesFilterCriJobApp.customDate = true;
						   }else if(scope.appliesFilterCriJobApp.dateFrom == null || scope.appliesFilterCriJobApp.dateTo == null){
								scope.appliesFilterCriJobApp.customDate = false;
							}
						   if(scope.appliesFilterCriJobApp.dateFrom != null && scope.appliesFilterCriJobApp.dateTo != null && date1 > date2 &&
			                  (date1.getDate() != date2.getDate() || date1.getMonth() != date2.getMonth() || date1.getFullYear() != date2.getFullYear())){
							 scope.appliesFilterCriJobApp.inValidMessage = "Please select a valid date";
						   }else{
						   scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp, selectedCall:"filter"});}
						   scope.appliesFilterCri = scope.appliesFilterCriJobApp
					   }
					   
					   scope.advancedSearch = function() {
						   scope.advancedSearchTextMaxLimit = false;
						   scope.advancedSearchLengthMaxLimit = false;

						   if(scope.input.anyOfTheseWords != undefined) {
							   if(scope.input.anyOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;
							   }
							   var searchTextArr = scope.input.anyOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['anyOfTheseWords'] = scope.input.anyOfTheseWords;
						   }
						   if(scope.input.anyOfTheseWordsExactMatch != undefined) {
							   if(scope.input.anyOfTheseWordsExactMatch.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;
							   }
							   var searchTextArr = scope.input.anyOfTheseWordsExactMatch.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['anyOfTheseWordsExactMatch'] = scope.input.anyOfTheseWordsExactMatch;
						   }
						   if(scope.input.allOfTheseWords != undefined) {
							   if(scope.input.allOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.allOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['allOfTheseWords'] = scope.input.allOfTheseWords;
						   }
						   if(scope.input.exactPhrase != undefined) {
							   if(scope.input.exactPhrase.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.exactPhrase.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['exactPhrase'] = scope.input.exactPhrase;
						   }
						   if(scope.input.noneOfTheseWords != undefined) {
							   if(scope.input.noneOfTheseWords.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.noneOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['noneOfTheseWords'] = scope.input.noneOfTheseWords;
						   }
						   if(scope.input.andWithin != undefined) {
							   if(scope.input.andWithin.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.andWithin.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
							   scope.appliesFilterCriJobApp['andWithin'] = scope.input.andWithin;
						   }
						   if(scope.input.locationAdvancedSearch != undefined) {
							   if(scope.input.locationAdvancedSearch.split(/(?:,| )+/).length>32){
								   scope.advancedSearchTextMaxLimit = true;
								   return;							   }
							   var searchTextArr = scope.input.locationAdvancedSearch.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										scope.advancedSearchLengthMaxLimit = true;
										return;
									}
								}
				       			scope.appliesFilterCriJobApp['locationAdvancedSearch'] = scope.input.locationAdvancedSearch;
				       	   } 
						   scope.setExperienceAndTalentPoolCriteriaObject();
						   scope.appliesFilterCriJobApp["searchType"] =  'advancedSearch';
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
					   
					   scope.setExperienceAndTalentPoolCriteriaObject = function() {
				       		var tempObj = {};
				       		
				       		if(!scope.appliesFilterCriJobApp.experienceAdvancedSearch) {
				       			scope.appliesFilterCriJobApp.experienceAdvancedSearch = [];
				       		}
				       		if(scope.input.minExperience>=0 && scope.input.minExperience != '') {
				       			tempObj['from'] = scope.input.minExperience;
				       		} else {
				       			tempObj['from'] = -1;
				       		}
				       		if(scope.input.maxExperience>=0 && scope.input.maxExperience != '') {
				       			tempObj['to'] = scope.input.maxExperience;
				       		} else{
				       			tempObj['to'] = 100;
				       		}	
				       		if(Object.keys(tempObj).length > 0) {	       			
				       			scope.appliesFilterCriJobApp.experienceAdvancedSearch[0] = tempObj;		
				       		}
				       		
				       	}
				       	
				       	scope.dateFieldDisplayName="";
				       	if(scope.dateFieldsInfo.dateColumnName == 'By Freshness'){
				       		scope.dateFieldDisplayName="Applied Date";
				       	} else if(scope.dateFieldsInfo.dateColumnName == 'By Modified Date'){
				     		scope.dateFieldDisplayName="Last Action Date";
				     	} else{
				     		scope.dateFieldDisplayName = scope.dateFieldsInfo.dateColumnName;
				     	}
				       	$rootScope.dateFieldDisplayNameGlobal = scope.dateFieldDisplayName;
				       	$rootScope.dateFieldsInfoGlobal = scope.dateFieldsInfo;
 						var sortField = JSON.parse(sessionStorage.getItem('sortedFieldDetail'));
						if(sortField.name == 'modifiedDate' || sortField.name == 'dateApplied'){
							scope.sort = {
				            active: scope.dateFieldsInfo.dateColumnFieldName,
				            descending: sortField.isAscending
	        				}
						}else{
						scope.sort = {
				            active: sortField.name,
				            descending: sortField.isAscending
	        			}}
				       	 				   
					   scope.selectedTagApplText = "";
					   scope.freeTextApplicantSearch = function(){
						   if(scope.input!=undefined && scope.input.freeTextApplicantName.split(/(?:,| )+/).length>32){
								 scope.input.freeTextApplicantName = "";
								 }
							 if(scope.input!=undefined ){
								 var searchTextArr = scope.input.freeTextApplicantName.split(/(?:,| )+/);
									for (var i =0; i < searchTextArr.length ; i++){
										if( searchTextArr[i].length > 50){
											 scope.input.freeTextApplicantName = "";
											break;
										}
									}
								 }
						   if(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Applicant"+" : "+scope.selectedTagApplText})) >= 0){
							   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Applicant"+" : "+scope.selectedTagApplText})), 1);
						   }
						   scope.appliesFilterCriJobApp['freeTextApplicantName'] = scope.input.freeTextApplicantName;
						   if(scope.input.freeTextApplicantName) {
							   scope.selectedFilterTags.push({'text':"Applicant : "+scope.input.freeTextApplicantName});
						   }
						   scope.selectedTagApplText = scope.input.freeTextApplicantName;
						   scope.appliesFilterCriJobApp['searchType'] = 'textSearch';
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
					   

					   scope.selectedTagJobTitleCodeText = "";
					   scope.freeTextJobTitleAndCodeSearch = function(){
						   if(scope.input!=undefined && scope.input.freeTextJobTitleAndCode.split(/(?:,| )+/).length>32){
								 scope.input.freeTextJobTitleAndCode = "";
								 }
							 if(scope.input!=undefined ){
								 var searchTextArr = scope.input.freeTextJobTitleAndCode.split(/(?:,| )+/);
									for (var i =0; i < searchTextArr.length ; i++){
										if( searchTextArr[i].length > 50){
											 scope.input.freeTextJobTitleAndCode = "";
											break;
										}
									}
								 }
						   if(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Job Applied"+" : "+scope.selectedTagJobTitleCodeText})) >= 0){
							   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Job Applied"+" : "+scope.selectedTagJobTitleCodeText})), 1);
						   }
						   scope.appliesFilterCriJobApp['freeTextJobTitleAndCode'] = scope.input.freeTextJobTitleAndCode;
						   if(scope.input.freeTextJobTitleAndCode) {
							   scope.selectedFilterTags.push({'text':"Job Applied : "+scope.input.freeTextJobTitleAndCode});
						   }
						   scope.selectedTagJobTitleCodeText = scope.input.freeTextJobTitleAndCode;
						   scope.appliesFilterCriJobApp['searchType'] = 'textSearch';
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
					   

					   scope.selectedTagFreeText = "";
					   scope.freeTextSearch = function(){
						   scope.talentPoolSearchTextMaxLimit = false;
						   scope.talentPoolSearchTextLengthMaxLimit = false;
						   if(scope.input!=undefined && scope.input.anyOfTheseWords.split(/(?:,| )+/).length>32){
								scope.talentPoolSearchTextMaxLimit = true;
								return;
							 }
						   if(scope.input!=undefined ){
								var searchTextArr = scope.input.anyOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										$scope.talentPoolSearchTextLengthMaxLimit = true;
										return;
									}
								}
							 }
						   if(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Keyword"+" : "+scope.selectedTagFreeText})) >= 0){
							   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Keyword"+" : "+scope.selectedTagFreeText})), 1);
						   } else if(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Keyword"+" : "+scope.appliesFilterCriJobApp['anyOfTheseWords']})) >= 0){
							   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"Keyword"+" : "+scope.appliesFilterCriJobApp['anyOfTheseWords']})), 1);
						   }
						   scope.appliesFilterCriJobApp['anyOfTheseWords'] = scope.input.anyOfTheseWords;
						   if(scope.input.anyOfTheseWords !== "") {
							   scope.selectedFilterTags.push({'text':"Keyword : "+scope.input.anyOfTheseWords});
						   }
						   scope.selectedTagFreeText = scope.input.anyOfTheseWords;
						   sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags));
						   scope.appliesFilterCriJobApp['searchType'] = 'textSearch';
						   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
					   scope.withOrWithoutResumeSelect = function(val){
						   var fromCount = 0;
						   if(scope.appliesFilterCriJobApp.withOrWithoutResume[1-val] == val){
							   scope.appliesFilterCriJobApp.withOrWithoutResume[1-val] = 1-val;
						   }else if(scope.appliesFilterCriJobApp.withOrWithoutResume[1-val] == 1-val){
							   scope.appliesFilterCriJobApp.withOrWithoutResume[1-val] = val;
						   }
						   if(scope.appliesFilterCriJobApp.withOrWithoutResume[0] == 0 && scope.appliesFilterCriJobApp.withOrWithoutResume[1] == 1)
						   {fromCount = 0}
						   scope.appliesFilterCriJobApp['searchType'] = 'facetSearch';
						   scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
					  // alert(localStorage.getItem("applyListFilterCri"));
					   scope.isEmpty = function(field){
						   return scope.appliesFilterCri[field].length == 0;
					   }
					   
					   scope.checkAllJobApp = function(field){
						   var fromCount = 0;
						   if(scope.selectedAll[field]){
							   fromCount = 0;
							   scope.selectedAll[field] = false;
							   scope.appliesFilterCriJobApp.allFieldSelected[field] = [];
						   }else{
							   scope.selectedAll[field] = true;
							   scope.appliesFilterCriJobApp.allFieldSelected[field] = [];
							   scope.appliesFilterCriJobApp.allFieldSelected[field] = scope.currentFrameForFilterJobApp[field].length > 0 ? scope.currentFrameForFilterJobApp[field].map(function(a){return a.key;}) : scope.commonFilterStatusAndSource[field].map(function(a){return a.key;});
						   }
						   scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp,selectedCall:"filter"});
					   }
			   
					   async function updateUBAaction(actionName) {
							console.log('ubaupdate');
							var companyId = JSON.parse(localStorage.getItem('manageAPIGetConfigurationData')).companyCommonConfiguration.companyId;
							const trackingData = {
								pageName : 'ZwayamPage',
					            eventName: 'userAction',
					            keyNames: {
									action_name : actionName,
									company_id : companyId.toString(),
									email_id : localStorage.getItem('userName'),
									user_id : localStorage.getItem('loginUserId')
					            }
					        }
						  	ubaService.doTracking(trackingData);
						}
						
						scope.triggerUBAAction = function(userAction){
							updateUBAaction(userAction);
						}
						
					   scope.checkSelectedJobApp = function(filterValue,filterName)
					   {	
					   		var pageUrl = $location.absUrl();
					   		var page = "ja";
					   		 if(pageUrl.indexOf('appliesListView') > -1){
					   		 	page = "da";
					   		 }else if(pageUrl.indexOf('approvals') > -1){
					   		 	page = "ap";
					   		 }else if(pageUrl.indexOf('talent-pool-search') > -1){
					   		 	page = "tp";
					   		 }
					   		var filterNameTp = filterName.replace(/ /g,"");
					   	   updateUBAaction(page+'_filter_'+filterNameTp+"_"+filterValue);
						   var fromCount = 0;	
						   if(!scope.appliesFilterCriJobApp.allFieldSelected.hasOwnProperty(filterName)){
							   scope.appliesFilterCriJobApp.allFieldSelected[filterName] = [];
							   scope.currentFrameForFilterJobApp[filterName] =[];
							   scope.commonFilterStatusAndSource[filterName] = [];
						   }
						   if(scope.appliesFilterCriJobApp.allFieldSelected[filterName].indexOf(filterValue) != -1){
							   scope.selectedAll[filterName] = false;
							   scope.appliesFilterCriJobApp.allFieldSelected[filterName] = _.without(scope.appliesFilterCriJobApp.allFieldSelected[filterName],filterValue);
							   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':filterName+" : "+filterValue})), 1);
						   }else{
							   if(filterName.includes("Top Matches")){
								   scope.appliesFilterCriJobApp.allFieldSelected[filterName] = [];
								   scope.currentFrameForFilterJobApp[filterName] =[];
								   scope.commonFilterStatusAndSource[filterName] = [];
						
								   var selectedFilter = [];
								   for(var i in scope.selectedFilterTags){
									   if(!(scope.selectedFilterTags[i].text.includes("Top Matches"))){
										   selectedFilter.push({'text':filterName+" : "+filterValue});
									   }
								   }
								   scope.selectedFilterTags = selectedFilter;
							   }
							  scope.selectedFilterTags.push({'text':filterName+" : "+filterValue});
    						  scope.appliesFilterCriJobApp.allFieldSelected[filterName].push(filterValue);
						   }
						   if(scope.appliesFilterCriJobApp.allFieldSelected[filterName].length == 0){
							   fromCount = 0;
						   }
						   
						   if( scope.selectedFilterTags.length > 0){
							   if(scope.currentFrameForFilterJobApp[filterName].length == 0)
								   scope.currentFrameForFilterJobApp[filterName] =scope.commonFilterStatusAndSource[filterName];
						   }else{
							   scope.currentFrameForFilterJobApp[filterName] = [];
						   }
						   scope.currentFrameForFilter['match'] = [];
						   scope.currentFrameForFilter['dateFacet'] = [];
						   sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags));
						   scope.appliesFilterCriJobApp['searchType'] = 'facetSearch';
						   scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp, selectedCall:"filter"});
					   };
					   
					   
					   scope.checkAllDateColumn = function(){
							var dateFacetOrColumn = 'dateColumn';
							if(scope.dateFieldsInfo.dateColumnName === scope.dateFieldsInfo.dateFacetName) {
								dateFacetOrColumn = 'dateFacet';
							}
						   var fromCount = 0;
						   if(scope.selectedAllDateColumn){
							   scope.selectedAllDateColumn = false;
							   scope.appliesFilterCri[dateFacetOrColumn] = [];
				               scope.commonFilterDate.filterSelect = false;
						   }else{
							   scope.selectedAllDateColumn = true;
							   scope.commonFilterDate.filterSelect = true;
							   scope.appliesFilterCri[dateFacetOrColumn] = [];
							   if(scope.currentFrameForFilter[dateFacetOrColumn].length != 0){
								   angular.forEach(scope.currentFrameForFilter[dateFacetOrColumn], function(v, k){
                                       if(v.doc_count > 0){
                                               var createObjForDate = {};
                                               createObjForDate.to_as_string = v.to_as_string;
                                               createObjForDate.from_as_string = v.from_as_string;
                                               createObjForDate.rangeName = v.rangeName;
                                               createObjForDate.doc_count = v.doc_count;
                                               scope.appliesFilterCri[dateFacetOrColumn].push(createObjForDate);
                                       }
                                })
							   }else{
								   angular.forEach(scope.commonFilterDate[dateFacetOrColumn], function(v, k){
                                       if(v.doc_count > 0){
                                               var createObjForDate = {};
                                               createObjForDate.to_as_string = v.to_as_string;
                                               createObjForDate.from_as_string = v.from_as_string;
                                               createObjForDate.rangeName = v.rangeName;
                                               createObjForDate.doc_count = v.doc_count;
                                               scope.appliesFilterCri[dateFacetOrColumn].push(createObjForDate);
                                       }
                                })
							   }
						   }
						   scope.appliesFilterCri['searchType'] = 'facetSearch';
						   scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCri, selectedCall:"filter"});
					   }
					   
					   scope.checkSelectedMatchApplied = function(val)
						 {	
						  /* if(scope.pagePath.indexOf("/approvals") != -1){
								 scope.appliesFilterCri = scope.appliesFilterCriJobApp;
							 }*/
						    scope.appliesFilterCri = scope.appliesFilterCriJobApp;
						   var fromCount = 0;
						 	if(_.findIndex(scope.appliesFilterCri.match,{rangeName: val.rangeName}) != -1	){
						 		scope.selectedAllMatchApplied = false;
						 		scope.appliesFilterCri['match'] = _.reject(scope.appliesFilterCri.match,function(v){ return v.rangeName === val.rangeName; });
						 		 scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':"fit : "+val.rangeName})), 1);
						 	}else{
								scope.appliesFilterCri.match.push(val);
								scope.selectedFilterTags.push({'text':"match : "+val.rangeName});
							}
						 	
							 if(_.size(scope.appliesFilterCri.match) == 0)
							 {fromCount = 0;}
							 scope.currentFrameForFilter['dateFacet'] = [];
							 if(scope.facetConfig!=null && scope.facetConfig!=undefined){
								for(var i=0;i<scope.facetConfig.jobApplication.length;i++){ 
									scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
								} 
							 }
							 if(scope.currentFrameForFilter.match.length == 0  && scope.selectedFilterTags.length > 0){
								 scope.currentFrameForFilter['match'] = scope.commonFilterStatusAndSource.match;
							 }
							 if(scope.pagePath.indexOf("/approvals") != -1){
								 sessionStorage.setItem(scope.sessionStorageVar, JSON.stringify(scope.appliesFilterCri)); 
							 }
							 sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags));
							 scope.appliesFilterCri['searchType'] = 'facetSearch';
							 scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCri, selectedCall:"filter"});
						 };
						 
						 scope.isMatchPresent = function(field){
							 return _.findIndex(scope.appliesFilterCri.match,{rangeName: field}) != -1;
						 }
					   
					 scope.checkSelectedDateApplied = function(dateFacetOrColumn, filterName, val)
					 {	
						var filterCheck = dateFacetOrColumn ;
						 if(scope.dateFieldsInfo.dateColumnName === scope.dateFieldsInfo.dateFacetName) {
							 dateFacetOrColumn = 'dateFacet';
						 }
						 var fromCount = 0;
					     if(filterCheck == 'dateFacet'  || filterCheck =='noticePeriod'){
						    if(_.findIndex(scope.appliesFilterCriJobApp[dateFacetOrColumn],{rangeName: val.rangeName}) != -1	){
					 		   scope.selectedAllDateColumn = false;
					 		   scope.appliesFilterCriJobApp[dateFacetOrColumn] = _.reject(scope.appliesFilterCriJobApp[dateFacetOrColumn],function(v){ return v.rangeName === val.rangeName; });
					 		   scope.selectedFilterTags.splice(_.indexOf(scope.selectedFilterTags, _.findWhere(scope.selectedFilterTags, { 'text':filterName+" : "+val.rangeName})), 1);
						 	}else{
								if(scope.appliesFilterCriJobApp[dateFacetOrColumn] == undefined){
									scope.appliesFilterCriJobApp[dateFacetOrColumn] =[];}
								scope.appliesFilterCriJobApp[dateFacetOrColumn].push(val);
								scope.selectedFilterTags.push({'text':filterName+" : "+val.rangeName});
							}
					     }else{
						    scope.appliesFilterCriJobApp[dateFacetOrColumn] = [];
					        scope.appliesFilterCriJobApp[dateFacetOrColumn].push(val);
							if(scope.selectedFilterTags.length == 0){
								indexOfDateColumn = scope.selectedFilterTags.length;
								scope.selectedFilterTags.push({'text':filterName+" : "+val.rangeName});
							}else if(scope.appliesFilterCriJobApp.filterSelect == true){
						        scope.selectedFilterTags.splice(indexOfDateColumn,1,{'text':filterName+" : "+val.rangeName});
							}else{
								indexOfDateColumn = scope.selectedFilterTags.length;
								scope.selectedFilterTags.push({'text':filterName+" : "+val.rangeName});}
					        scope.appliesFilterCriJobApp.filterSelect = true;
					     }
						 

						 scope.currentFrameForFilter['match'] = [];
						 if(scope.facetConfig!=null && scope.facetConfig!=undefined){
							 for(var i=0;i<scope.facetConfig.jobApplication.length;i++){ 
								   scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
							   } 
						 }
						 
						 if(dateFacetOrColumn == 'dateFacet') {
							 if(scope.currentFrameForFilter['dateColumn'].length == 0) {
								 scope.currentFrameForFilter.dateColumn = scope.commonFilterDate.dateColumn; 
							 }	 
							 if(scope.currentFrameForFilter['dateFacet'].length == 0  && 
									(scope.dateFieldsInfo.dateColumnName === scope.dateFieldsInfo.dateFacetName 
										|| scope.selectedFilterTags.length > 0)) {
								 scope.currentFrameForFilter.dateFacet = scope.commonFilterDate.dateFacet; 
							 }
						 }
						 
						 if(dateFacetOrColumn == 'dateColumn') {
							 if(scope.currentFrameForFilter['dateFacet'].length == 0) {
								 scope.currentFrameForFilter.dateFacet = scope.commonFilterDate.dateFacet; 
							 }	 
							 if(scope.currentFrameForFilter['dateColumn'].length == 0  && scope.selectedFilterTags.length > 0) {
								 scope.currentFrameForFilter.dateColumn = scope.commonFilterDate.dateColumn; 
							 }
						 }
						 if(dateFacetOrColumn == 'noticePeriod') {
                             if(scope.currentFrameForFilter['noticePeriod'].length == 0) {
								 scope.currentFrameForFilter.noticePeriod = scope.commonFilterDate.noticePeriod; 
							 }	 
						  }
						 if(scope.pagePath.indexOf("/approvals") != -1){
							 //scope.appliesFilterCriJobApp[filterCheck] = scope.appliesFilterCri[filterCheck];
						     //scope.appliesFilterCriJobApp.filterSelect = scope.appliesFilterCri.filterSelect;
							 //scope.appliesFilterCriJobApp.customDate = scope.appliesFilterCri.customDate;
							 //scope.appliesFilterCri = scope.appliesFilterCriJobApp;
							 sessionStorage.setItem(scope.sessionStorageVar, JSON.stringify(scope.appliesFilterCriJobApp)); 
						 }
						 sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags));  
						 scope.appliesFilterCri = scope.appliesFilterCriJobApp;
						 scope.appliesFilterCriJobApp['searchType'] = 'facetSearch';
						 scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp, selectedCall:"filter"});
					 };
					 
					 
					 scope.isDatePresent = function(dateFacetOrColumn, field){
						 if(scope.dateFieldsInfo.dateColumnName !== scope.dateFieldsInfo.dateFacetName) {
							return _.findIndex(scope.appliesFilterCri[dateFacetOrColumn],{rangeName: field}) != -1;  
						 } 
						 return _.findIndex(scope.appliesFilterCri.dateFacet,{rangeName: field}) != -1;
					}
					
					 scope.isRangePresent = function(dateFacetOrColumn, field){
						 if(scope.dateFieldsInfo.dateColumnName !== scope.dateFieldsInfo.dateFacetName) {
							return _.findIndex(scope.appliesFilterCri[dateFacetOrColumn],{rangeName: field}) != -1;  
						 } 
						 return _.findIndex(scope.appliesFilterCri.noticePeriod,{rangeName: field}) != -1;
					}

					 	if(scope.appliesFilterCri  && scope.appliesFilterCri.appliesFilter && scope.appliesFilterCri.appliesFilter.hasOwnProperty('experience') && scope.appliesFilterCri.appliesFilter['experience'][0]) {
							if(scope.appliesFilterCri.appliesFilter['experience'][0]['from']) {
								scope.input.expFrom = scope.appliesFilterCri.appliesFilter['experience'][0]['from'];
							}
							if(scope.appliesFilterCri.appliesFilter['experience'][0]['to']) {
								scope.input.expTo = scope.appliesFilterCri.appliesFilter['experience'][0]['to'];
							}
							if(scope.input.expFrom == -1) {
								scope.input.expFrom = null;
							}
							if(scope.input.expTo == 100) {
								scope.input.expTo = null;
							}
						} else {
							scope.input.expFrom=null;
							scope.input.expTo=null;
						}
						
						if(scope.appliesFilterCri  && scope.appliesFilterCri.appliesFilter && scope.appliesFilterCri.appliesFilter.hasOwnProperty('currentCtc') && scope.appliesFilterCri.appliesFilter['currentCtc'][0]) {
							if(scope.appliesFilterCri.appliesFilter['currentCtc'][0]['from']) {
								scope.input.ctcFrom = scope.appliesFilterCri.appliesFilter['currentCtc'][0]['from'];
							}
							if(scope.appliesFilterCri.appliesFilter['currentCtc'][0]['to']) {
								scope.input.ctcTo = scope.appliesFilterCri.appliesFilter['currentCtc'][0]['to'];
							}
							if(scope.appliesFilterCri.appliesFilter['currentCtc'][0]['type']) {
								scope.input.type = scope.appliesFilterCri.appliesFilter['currentCtc'][0]['type'];
							}
							if(scope.input.ctcFrom == -1) {
								scope.input.ctcFrom = null;
							}
							if(scope.input.ctcTo == 100) {
								scope.input.ctcTo = null;
							}
						} else {
							scope.input.ctcFrom=null;
							scope.input.ctcTo=null;
							scope.input.type="INR";
						}
					 
					  
					 scope.expRangeToAndFrom = function(evt){
						 //scope.appliesFilterCri['experience'] = [];
						 var objExp = {};
						 var fromCount = 0;
						 if(evt!=undefined && evt.which !== 13) {
							return;
						  }
						// scope.appliesFilterCri.experience["from"] =
							 objExp.from  = (scope.input.expFrom == null) ?-1:scope.input.expFrom;
						// scope.appliesFilterCri.experience["to"] 
							 objExp.to = (scope.input.expTo != null)?scope.input.expTo:100;
						 scope.appliesFilterCriJobApp.experience[0] = objExp;
						 if((scope.input.expFrom != null && scope.input.expTo != null && scope.input.expFrom <= scope.input.expTo) || (scope.input.expFrom != null && scope.input.expTo == null) || ( scope.input.expFrom == null && scope.input.expTo != null) || (scope.input.expFrom == null && scope.input.expTo == null)){
							 scope.appliesFilterCriJobApp['searchType'] = 'facetSearch';
							 scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp, selectedCall:"filter"});
							 scope.currentFrameForFilter['dateFacet'] = [];
							 scope.currentFrameForFilter['match'] = [];
							 if(scope.facetConfig!=null && scope.facetConfig!=undefined){
								 for(var i=0;i<scope.facetConfig.jobApplication.length;i++){ 
									   scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
								   } 
							 }
						 }
					 }
					 
					 scope.ctcRangeToAndFrom = function(evt){
						if(evt!=undefined && evt.which !== 13) {
							return;
						  }
						if(evt && scope.isNumberKey(evt)){
								scope.invalidCtc = false;
							    scope.invalidCtcMessage = "";
							if(scope.input && scope.input.ctcFrom){
								var valid = !isNaN(scope.input.ctcFrom);
									if(valid!=true){
										scope.invalidCtc = true;
										scope.invalidCtcMessage = "Invalid input";
										return;
									}
							}
							if(scope.input && scope.input.ctcTo){
								var valid = !isNaN(scope.input.ctcTo);
									if(valid!=true){
										scope.invalidCtc = true;
										scope.invalidCtcMessage = "Invalid input";
										return;
									}
							}

							var objCtc = {};
							 var fromCount = 0;
							 objCtc.from  = (scope.input.ctcFrom == null || scope.input.ctcFrom == "" ) ?null:scope.input.ctcFrom;
							 objCtc.to = (scope.input.ctcTo != null)?scope.input.ctcTo:scope.input.ctcTo;
							 objCtc.to = (scope.input.ctcTo == null || scope.input.ctcTo=="")?null:scope.input.ctcTo;
							 objCtc.type = scope.input.type;
						 scope.appliesFilterCriJobApp.currentCtc[0] = objCtc;
						 var validateCtc = scope.validateCtc();
						 if(validateCtc==false){
								return;
						 }
						 
						 
						 if((scope.input.ctcFrom != null && scope.input.ctcTo != null && parseFloat(scope.input.ctcFrom) <= parseFloat(scope.input.ctcTo)) || 
						 (scope.input.ctcFrom != null && (scope.input.ctcTo == null ||scope.input.ctcTo == "")) 
						  || ( scope.input.ctcFrom == null && scope.input.ctcTo != null) || (scope.input.ctcTo != null && (scope.input.ctcFrom == null ||scope.input.ctcFrom == ""))){
						 	
							 scope.appliesFilterCriJobApp['searchType'] = 'facetSearch';
							 scope.recruiterApplyListCallback({from:fromCount,appliesObj : scope.appliesFilterCriJobApp, selectedCall:"filter"});
							 scope.currentFrameForFilter['dateFacet'] = [];
							 scope.currentFrameForFilter['match'] = [];
							 if(scope.facetConfig!=null && scope.facetConfig!=undefined){
								 for(var i=0;i<scope.facetConfig.jobApplication.length;i++){ 
									   scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
								   } 
							 }
						 }
						}
						 
					 }
					 
					 scope.isNumberKey = function(evt){
						scope.invalidCtc = false;
						scope.invalidCtcMessage = "";
						var charCode = (evt.which) ? evt.which : evt.keyCode;
				         if (charCode != 46 && charCode > 31 
				           && (charCode < 48 || charCode > 57)){
								scope.invalidCtc = true;
								scope.invalidCtcMessage = "Invalid input";
								return false;
							}
							
				         return true;
					 }
					 
					 scope.validateCtc = function(){
						if(parseFloat(scope.input.ctcFrom)<scope.facetConfig.ctcFieldValues.minCTCinINR || parseFloat(scope.input.ctcTo)>scope.facetConfig.ctcFieldValues.maxCTCinINR){
								scope.invalidCtc = true;
								scope.invalidCtcMessage = "CTC should be within " + scope.facetConfig.ctcFieldValues.minCTCinINR + " and "
								+ scope.facetConfig.ctcFieldValues.maxCTCinINR + " lakhs";
								return false;
						}
						
						if(parseFloat(scope.input.ctcTo) <  parseFloat(scope.input.ctcFrom)){
								scope.invalidCtc = true;
								scope.invalidCtcMessage = "Min CTC should be less than Max CTC";
								return false;
						}
						
						return true;
					 }
					 
					 scope.setTextCriteriaEmpty = function() {
						 scope.input.anyOfTheseWords = '';
						 scope.input.anyOfTheseWordsExactMatch = '';
						 scope.input.allOfTheseWords = '';
						 scope.input.exactPhrase = '';
						 scope.input.noneOfTheseWords = '';
						 scope.input.locationAdvancedSearch = '';
						 scope.input.andWithin = '';
						 scope.input.experience = [];
						 scope.input.currentCtc = [];
						 scope.input.minExperience = null;
						 scope.input.maxExperience = null;
					 }
					 
					 scope.clearAllFromAdvSearch = function() {
						 scope.advancedSearchTextMaxLimit = false;
						 scope.setTextCriteriaEmpty();
						 scope.appliesFilterCri['anyOfTheseWords'] = '';
						 scope.appliesFilterCri['anyOfTheseWordsExactMatch'] = '';
						 scope.appliesFilterCri['allOfTheseWords'] = '';
						 scope.appliesFilterCri['exactPhrase'] = '';
						 scope.appliesFilterCri['noneOfTheseWords'] = '';
						 scope.appliesFilterCri['andWithin'] = '';
						 scope.appliesFilterCri['locationAdvancedSearch'] = '';  
						 scope.appliesFilterCri.experienceAdvancedSearch = [{'from':null,'to':null}];
						 scope.appliesFilterCri['searchType'] = 'facetSearch';
						 scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCri,selectedCall:"filter"});
						 
					 }
					 
					 scope.clearSideFilter = function(){
					 	var pageUrl = $location.absUrl();
				   		var page = "ja";
				   		 if(pageUrl.indexOf('appliesListView') > -1){
				   		 	page = "da";
				   		 }else if(pageUrl.indexOf('approvals') > -1){
				   		 	page = "ap";
				   		 }else if(pageUrl.indexOf('talent-pool-search') > -1){
				   		 	page = "tp";
				   		 }
					   	 updateUBAaction(page+'_filter_Clear All');
						 var fromCount = 0;
						 scope.selectedFilterTags = [];
						 scope.freeTextApplicantName = "";
						 scope.freeTextJobTitleAndCode = "";
						 scope.setTextCriteriaEmpty();
						 scope.anyOfTheseWords = "";
						 scope.expFrom=null;
						 scope.expTo=null;
						 scope.input.expFrom = null;
						 scope.input.expTo = null;
						 scope.input.freeTextJobTitleAndCode = "";
						 scope.input.freeTextApplicantName = ""
						 scope.currentFrameForFilter = {};
						 scope.currentFrameForFilter['dateColumn'] = [];
						 scope.currentFrameForFilter['dateFacet'] = [];
						 scope.currentFrameForFilter['match'] = [];
					     scope.currentFrameForFilter['noticePeriod'] =[];
						 scope.appliesFilterCriJobApp['freeTextApplicantName'] = "";
						 scope.appliesFilterCriJobApp['freeTextJobTitleAndCode'] = "";
						 scope.appliesFilterCriJobApp['anyOfTheseWords'] = "";
						 scope.appliesFilterCriJobApp['experience'] = [];
						 scope.appliesFilterCriJobApp['currentCtc'] = [];
						 scope.appliesFilterCriJobApp['dateColumn'] = [];
						 scope.appliesFilterCriJobApp['dateFacet'] = [];
						 scope.appliesFilterCriJobApp['match'] = [];
					     scope.appliesFilterCriJobApp['noticePeriod'] = [];
					     scope.appliesFilterCriJobApp.dateFrom ="";
						 scope.appliesFilterCriJobApp.dateTo = "";
						 scope.appliesFilterCriJobApp['withOrWithoutResume'] = [0,1];
						 scope.appliesFilterCriJobApp['ctcType'] = "INR";
						 scope.selectedTagFreeText = "";
						 scope.selectedTagApplText = "";
						 scope.selectedAllDateColumn = false;
						 scope.commonFilterDateApplyJobApp = {};
						 //scope.appliesFilterCriJobApp =  scope.appliesFilterCri;
						 scope.commonFilterDate.inValidMessage ="";
						 scope.appliesFilterCri.filterSelect = false;
					     scope.appliesFilterCri.customDate = false;
						 scope.appliesFilterCriJobApp.allFieldSelected = {}
					     scope.appliesFilterCri.inValidMessage ="";
						 if(scope.facetConfig!=null && scope.facetConfig!=undefined){ 
							 for(var i=0;i<scope.facetConfig.jobApplication.length;i++){
							   scope.currentFrameForFilterJobApp[scope.facetConfig.jobApplication[i].displayName] = [];
							   scope.appliesFilterCriJobApp.allFieldSelected[scope.facetConfig.jobApplication[i].displayName] = [];   
						   }
						 }
						 scope.selectedTagJobTitleCodeText = "";
						 sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags)); 
						if(scope.pagePath.indexOf("/approvals") != -1){
						 sessionStorage.setItem(scope.sessionStorageVar,JSON.stringify(scope.appliesFilterCri));
						 }
						 scope.recruiterApplyListCallback({from:fromCount,appliesObj : null, selectedCall:"clearFilter"});
					 }
					 
					 scope.onKeyPressForApplicant = function(event){
						 if(event.keyCode === 13){
							 if(event.keyCode === 13 && scope.input!=undefined && scope.input.freeTextApplicantName.split(/(?:,| )+/).length>32){
								 scope.input.freeTextApplicantName = "";
								 }
							 if(event.keyCode === 13 && scope.input!=undefined ){
								 var searchTextArr = scope.input.freeTextApplicantName.split(/(?:,| )+/);
									for (var i =0; i < searchTextArr.length ; i++){
										if( searchTextArr[i].length > 50){
											 scope.input.freeTextApplicantName = "";
											break;
										}
									}
								 }
							 scope.freeTextApplicantSearch();
						 }
					 }
					 scope.onKeyPressForJobApplied = function(event){
						 if(event.keyCode === 13){
							 if(event.keyCode === 13 && scope.input!=undefined && scope.input.freeTextJobTitleAndCode.split(/(?:,| )+/).length>32){
								 scope.input.freeTextJobTitleAndCode = "";
								 }
							 if(event.keyCode === 13 && scope.input!=undefined ){
								 var searchTextArr = scope.input.freeTextJobTitleAndCode.split(/(?:,| )+/);
									for (var i =0; i < searchTextArr.length ; i++){
										if( searchTextArr[i].length > 50){
											 scope.input.freeTextJobTitleAndCode = "";
											break;
										}
									}
								 }
							 scope.freeTextJobTitleAndCodeSearch();
						 }
					 }
					 
					 scope.setBooleanValueForSearchText = function(){
						 scope.talentPoolSearchTextMaxLimit = false;
						 scope.talentPoolSearchTextLengthMaxLimit = false;

						 if(scope.input!=undefined && scope.input.anyOfTheseWords!=undefined && scope.input.anyOfTheseWords.split(/(?:,| )+/).length>32){
							 scope.talentPoolSearchTextMaxLimit = true;
						 }
						 if(scope.input!=undefined && scope.input.anyOfTheseWords!=undefined ){
							 var searchTextArr = scope.input.anyOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										 scope.talentPoolSearchTextLengthMaxLimit = true;
										 break;
									}
								}
							 }
						 
					 }
					 scope.onKeyPressOnFreeText = function(event){
						 scope.talentPoolSearchTextMaxLimit = false;
						 scope.talentPoolSearchTextLengthMaxLimit = false;

						 if(scope.input!=undefined && scope.input.anyOfTheseWords!=undefined ){
							 var searchTextArr = scope.input.anyOfTheseWords.split(/(?:,| )+/);
								for (var i =0; i < searchTextArr.length ; i++){
									if( searchTextArr[i].length > 50){
										 scope.talentPoolSearchTextLengthMaxLimit = true;
										 return;
									}
								}
							 }
						 
						 if(event.keyCode === 13 && scope.input!=undefined && scope.input.anyOfTheseWords.split(/(?:,| )+/).length>32){
								scope.talentPoolSearchTextMaxLimit = true;
								return;
							 }
						 else {
							 if(event.keyCode === 13){
								 scope.freeTextSearch();
							 } 
							 scope.searchReco();
						 }
					 }
					 
					 scope.searchReco = function(){
						 if(scope.input.anyOfTheseWords!=undefined && scope.input.anyOfTheseWords.trim().length>=2){
							 scope.recruiterApplyListCallback({from:0,appliesObj : scope.input.anyOfTheseWords,selectedCall:"recommend"});
						 }
					 }
					 
					    

					    function suggest_state(term) {
					      if(term.length>2){
						      var states = scope.dashBoardApplyListCri==undefined ? scope.applyListFilterCri.states.hits.hits : scope.dashBoardApplyListCri.states.hits.hits;
						      var q = term.toLowerCase().trim();
						      var results = [];
						      var fields = new Set();
						      for (var i = 0; i < states.length; i++) {
						    	  fields.add(states[i]._source.criteria)
						      }
						      var setIter = fields.values();
						      // Find first 10 states that contains `term`.
						      for (var i = 0; i < fields.size && results.length < 10; i++) {
						        var state = setIter.next().value;
						        if (state.toLowerCase().indexOf(q) != -1 )
						          results.push({ label: state, value: state });
						      }

						      return results;
					      }
					    }

					    scope.autocomplete_options = {
					      suggest: suggest_state
					    };
					    
					 scope.getResourceIndex = function(resources, resource) {
						  var index = -1;
						  for (var i = 0; i < resources.length; i++) {
						    if (resources[i].rangeName == resource) {
						      index = i;
						      return index;
						    }
						  }
						  return -1;
						}
					 scope.selectedTagRemoved = function(tag){
						 var filterInfo = tag.text.split(' : ');
						 //if(scope.pagePath.indexOf("/approvals") != -1){
						 scope.appliesFilterCri = scope.appliesFilterCriJobApp;
						 //}
						 if(filterInfo[0] !== scope.dateFieldsInfo.dateFacetName && filterInfo[0] !== scope.dateFieldsInfo.dateColumnName) {
							 scope.appliesFilterCri[filterInfo[0]] = _.without(scope.appliesFilterCri[filterInfo[0]],filterInfo[1]);							 
						 }

						 if(filterInfo[0] == scope.dateFieldsInfo.dateColumnName) {
							 var indexDate = scope.getResourceIndex(scope.appliesFilterCri.dateColumn,filterInfo[1]);
							 scope.appliesFilterCri.dateColumn.splice(indexDate, 1);
						 }
						 if(filterInfo[0] == scope.dateFieldsInfo.dateFacetName) {
							 scope.appliesFilterCri.dateFacet.pop();
						 }
					     if(filterInfo[0] == "By Notice Period") {
						    scope.appliesFilterCri['noticePeriod'] = _.reject(scope.appliesFilterCri['noticePeriod'],function(v){ return v.rangeName === filterInfo[1]; });
							 scope.appliesFilterCri[filterInfo[0]].pop();
						 }
						 if(filterInfo[0] == "match") {
							 scope.appliesFilterCri[filterInfo[0]].pop();
						 }
						 if(filterInfo[0] == "Keyword"){
							 scope.appliesFilterCri['anyOfTheseWords'] = "";
							 scope.input.anyOfTheseWords = "";
						 }
						 if(filterInfo[0] == "Job Applied"){
							 scope.appliesFilterCri['freeTextJobTitleAndCode'] = "";
							 scope.input.freeTextJobTitleAndCode = "";
						 }
						 if(filterInfo[0] == "Applicant"){
							 scope.appliesFilterCri['freeTextApplicantName'] = "";
							 scope.input.freeTextApplicantName = "";
						 }
						 
						 if(scope.facetConfig!=null && scope.facetConfig!=undefined){
							 scope.appliesFilterCri.allFieldSelected[filterInfo[0]] = _.without(scope.appliesFilterCri.allFieldSelected[filterInfo[0]],filterInfo[1]);
							 for(var i=0;i<scope.facetConfig.jobApplication.length;i++){ 
								 if(filterInfo[0] == scope.facetConfig.jobApplication[i].displayName){
									 if( scope.selectedFilterTags.length > 0){
										   if(scope.currentFrameForFilterJobApp[filterInfo[0]].length == 0)
											   scope.currentFrameForFilterJobApp[filterInfo[0]] =scope.commonFilterStatusAndSource[filterInfo[0]];
									   }else{
										   scope.currentFrameForFilterJobApp[filterInfo[0]] = [];
									   }
									 break;
								 }
							   } 
						 }
						 
						   if(filterInfo[0] == "match"){
							   if(scope.currentFrameForFilter['match'].length == 0)
								   scope.currentFrameForFilter['match'] =scope.commonFilterStatusAndSource.match;
						   }else{
							   scope.currentFrameForFilter['match'] = [];
						   }
						   
						   var isExperienceFacetUsed = false;
						   if (scope.appliesFilterCri.experience != undefined && scope.appliesFilterCri.experience.length != 0) {
								if (!(scope.appliesFilterCri.experience[0]['from'] == -1 && scope.appliesFilterCri.experience[0]['to'] == 100)) {
									isExperienceFacetUsed = true;
								}
						   }
						   
						   var isCtcFacetUsed = false;
						   if (scope.appliesFilterCri.currentCtc != undefined && scope.appliesFilterCri.currentCtc.length != 0) {
								if (!(scope.appliesFilterCri.currentCtc[0]['from'] == -1 && scope.appliesFilterCri.currentCtc[0]['to'] == 100)) {
									isCtcFacetUsed = true;
								}
						   }		
						   
						   var isAdvancedExperienceFieldUsed = false;
						   if (scope.appliesFilterCri.experienceAdvancedSearch != undefined && scope.appliesFilterCri.experienceAdvancedSearch.length != 0) {
								if (!(scope.appliesFilterCri.experienceAdvancedSearch[0]['from'] == null && scope.appliesFilterCri.experienceAdvancedSearch[0]['to'] == null)) {
									isAdvancedExperienceFieldUsed = true;
								}
						   }
						   
						   var isWithOrWithoutResumeUsed = false;
						   if (scope.appliesFilterCri.withOrWithoutResume != undefined && scope.appliesFilterCri.withOrWithoutResume.length != 0) {
								if (!(scope.appliesFilterCri.withOrWithoutResume[0] == 0 && scope.appliesFilterCri.withOrWithoutResume[1] == 1)) {
									isWithOrWithoutResumeUsed = true;
								}
						}
						   
						   if(scope.selectedFilterTags.length == 0 && !scope.appliesFilterCri.anyOfTheseWords &&
								   !scope.appliesFilterCri.allOfTheseWords && !scope.appliesFilterCri.anyOfTheseWordsExactMatch &&
								   !scope.appliesFilterCri.exactPhrase && !scope.appliesFilterCri.noneOfTheseWords &&
								   !isExperienceFacetUsed && !isAdvancedExperienceFieldUsed &&
								   !scope.appliesFilterCri.customDate && !scope.appliesFilterCri.locationAdvancedSearch &&
								   !isWithOrWithoutResumeUsed && !isCtcFacetUsed){
							   scope.clearSideFilter();
						   } else {
							   sessionStorage.setItem(scope.pageType, JSON.stringify(scope.selectedFilterTags));  
							   scope.appliesFilterCri['searchType'] = 'facetSearch';
							   if(scope.pagePath.indexOf("/approvals") != -1){
							   sessionStorage.setItem(scope.sessionStorageVar,JSON.stringify(scope.appliesFilterCri));
							   }
							   scope.recruiterApplyListCallback({from:0,appliesObj : scope.appliesFilterCri, selectedCall:"filter"});
						   }
					}
					 
					 //##Top Filter ends
					 
					 //## for unsubscribed users start
					 scope.userPermissionForManageUser = localStorage.getItem('userPermissionForManageUser');
					 scope.upgradeplan = function() {
					      	$activityIndicator.startAnimating();
					      	if(scope.userPermissionForManageUser == 'true'){
					      		$location.path('/change-job-package');
					      	}else{
					      		$activityIndicator.stopAnimating();
					      		alert(PAYMENT_PERMISSION_ERROR);
					      	}
					    };
					 
					    scope.closegoodUpgrade = function() {
				        	$("#closeUpgrade").css('display','none');
				        	$("#closeUpgrade1").css('display','none');
				        };
					 //## for unsubscribed users ends
					 
					   //## modal for applies list
					   scope.showModal = function(url4modalPopUp)
						  {
							  scope.modalInstance = $modal.open({
								  templateUrl: url4modalPopUp,
								  windowClass: 'app-modal-window',
								  scope: scope 
								}); 
						  };
					   scope.viewJobDisable= false;  
					   scope.displyingJob = function(id){
						   if(scope.viewJobDisable !=true){
							services.getJobCustomFieldDetails(id,localStorage.getItem('sessionId'),localStorage.getItem('loginUserId')).then(function(data){
								scope.jobDetails = data.data.reponseObject.jobDetails;
								scope.dispJob = data.data.reponseObject.customDetails;
								scope.showModal('../common-files-v1.0/common-htmls/modal4DisplayJob.html');
							}).catch(function (error) {
								console.log("Something went wrong! Invalid API response", error);
							});
							scope.viewJobDisable = true;
						   }
							
						};
						scope.closeDisplayJob = function(){
							scope.modalInstance.close();
							scope.viewJobDisable= false;
						}
						
						//modal for note
						scope.applicationIdForNotes =function(applicantId){
							  scope.blankNote = false;
							  $rootScope.applicantId = applicantId;
							  scope.notesFromAddnotes = null;
							  scope.showModal('../common-files-v1.0/common-htmls/modal4note.html');
						};
						scope.notesFromAddnotes = "";
						scope.addNotes = function(){
							//alert(scope.notesFromAddnotes);
							 scope.blankNote = false;
						
						 var notes = scope.notesFromAddnotes;
						
						 if(notes == null || notes.length == 0){
							 scope.blankNote = true;
							
						 } else {
							
						 $activityIndicator.startAnimating();
						 scope.loggedAdminId=localStorage.getItem('loggedAdminIdAdminId');
						 if(scope.loggedAdminId==null || scope.loggedAdminId=='undefined'){
								scope.loggedAdminId=0;
							}
						 
						 scope.sessionId=localStorage.getItem('sessionId');
						 scope.loginUserId=localStorage.getItem('loginUserId');
						 var userId = localStorage.getItem('loginUserId');
						 services.saveNotesFromAddNotes($rootScope.applicantId, notes, userId,growl,scope.loggedAdminId,scope.sessionId,scope.loginUserId)
					     .then(function (response) {
					    	 $activityIndicator.stopAnimating();
					    		 
					    	 //$('#closeAddNotesPopUp').click();
					    	 scope.modalInstance.close();
					    	 if (response.data.webserviceAPIResponseCode == UNAUTHORIZED){
								 growl.error(UNAUTHORIZED_ERROR_MSG);
								 $('#logout').click();
								 return;
							 }
					    	 else if(response.data.code == 200){
					    		 growl.success(response.data.message);
						    	  scope.notesFromAddnotes = null;  
					    	 } else {
					    			growl.error(response.data.message);
					    		}
								
							});	
						 }
					 };

					 scope.getPageRouteFromScope = function() {
						 if(scope.pageScope.indexOf('dashBoardDrillDown') > -1) {
							return 'appliesListView';
						 } else if(scope.pageScope.indexOf('jobAppliesList') > -1) {
							return 'job-applications';
						 } else if(scope.pageScope == 'talentpool') {
							return 'talent-pool-search';
						 } else if(scope.pageScope == 'Approvals') {
							//TODO : Change the return type for approvals 
							return 'approvals';
						 } else if(scope.pageScope.indexOf('reqAppliesList') > -1) {
							return 'job-applications-new';
						 }
					 }
					 
				
					 scope.viewApplicationPage = function(id, jobTitle) {
						 if(scope.selectedFilterTags.length > 0){
								  sessionStorage.setItem(scope.pageType,JSON.stringify(scope.selectedFilterTags));
						 }
						 
					     $rootScope.jobApplicantId = id;
					     $rootScope.applicantJobTitle = jobTitle;
					     sessionStorage.setItem('jobApplicationId', $rootScope.jobApplicantId);
					     localStorage.setItem('appJobTitle', $rootScope.applicantJobTitle);
							
					     var operation = scope.getPageRouteFromScope();
							
					     if(scope.TPMatchingApplies) {
                             localStorage.setItem('reloadFromTP',true);
					     }
	
					     $location.path('/application-view/' + operation);
					     
					        	
					    };
					    scope.viewApplicationPageNewTab = function(id, jobTitle) {

							if(scope.selectedFilterTags.length > 0){
								sessionStorage.setItem(scope.pageType,JSON.stringify(scope.selectedFilterTags));
							}
							 					    	
						    $rootScope.jobApplicantId = id;
						    $rootScope.applicantJobTitle = jobTitle;
						    sessionStorage.setItem('jobApplicationId', $rootScope.jobApplicantId);
						    localStorage.setItem('appJobTitle', $rootScope.applicantJobTitle);
								
							var operation = scope.getPageRouteFromScope();
								
						    if(scope.TPMatchingApplies) {
						        //TPMatching Applies						    
						        localStorage.setItem('reloadFromTP',true);
	                        } 
						    
	                        window.open( '#/application-view/'+ operation + '/', '_blank'); 
	                        
					    };
					
						    scope.viewApplicationPageForHM = function(id, jobTitle, operation) {
							 	
						    	if(scope.selectedFilterTags.length > 0){
									  sessionStorage.setItem(scope.pageType,JSON.stringify(scope.selectedFilterTags));
								}
								 						    	
							        $rootScope.jobApplicantId = id;

							        $rootScope.applicantJobTitle = jobTitle;

							        sessionStorage.setItem('jobApplicationId', $rootScope.jobApplicantId);

							        localStorage.setItem('appJobTitle', $rootScope.applicantJobTitle);

							        $location.path('/application-view-new/' + operation);
							        	
							    };
							    scope.viewApplicationPageNewTabForHM = function(id, jobTitle, operation) {
								 	
							    	if(scope.selectedFilterTags.length > 0){
										  sessionStorage.setItem(scope.pageType,JSON.stringify(scope.selectedFilterTags));
									}
									 							    	
								        $rootScope.jobApplicantId = id;

								        $rootScope.applicantJobTitle = jobTitle;

								        sessionStorage.setItem('jobApplicationId', $rootScope.jobApplicantId);

								        localStorage.setItem('appJobTitle', $rootScope.applicantJobTitle);

								        window.open( '#/application-view-new/job-applications/', '_blank');
								    };
								    
					 scope.cancelNotes = function(){
						 scope.notesFromAddnotes = null;
						 scope.modalInstance.close();
					 };
					 //modal for note ends
					 
					 scope.getPendingFitmentApprovalList = function(applyId,currentStatus) {
						  
						 scope.status=null;
						 if(currentStatus.indexOf("L1") >-1){
							 scope.status="L1 Approver";
						 }else if(currentStatus.indexOf("L2") >-1){
							 scope.status="L2 Approver";
						 }else if(currentStatus.indexOf("L3") >-1){
							 scope.status="L3 Approver";
						 }else {
							 scope.status="L4 Approver";
						 }
							scope.sessionId=localStorage.getItem('sessionId');

							  services.getPendingFitmentApprovalList(applyId,scope.sessionId,scope.status).then(function(data) {
								  scope.approverEmailIds=data.data.reponseObject;
						    	
						     })
						}
					 //## download resume
					scope.downloadResume = function(id,fileName,type) {
						scope.sessionId=localStorage.getItem('sessionId');
						scope.loginUserId=localStorage.getItem('loginUserId');
							 
						scope.loggedAdminIdAdminId=localStorage.getItem('loggedAdminIdAdminId');
						if(scope.loggedAdminIdAdminId==null || scope.loggedAdminIdAdminId=='undefined'){
							scope.loggedAdminIdAdminId=0;
						}

						services.downloadResume(id,fileName,type,scope.sessionId,scope.loginUserId,scope.loggedAdminIdAdminId).then(function(data){
						});
					}
					//## download resume ends
					
					//## view resume
					$('#viewResumeModal').on('hidden.bs.modal', function () {	
						 // document.getElementById('resumeFrame').src = "";
			       });
					
					/*scope.viewDownloadResume = function(applicationId,fileName,type,jobsource) {
						scope.loggedAdminIdAdminId=localStorage.getItem('loggedAdminIdAdminId');
						if(scope.loggedAdminIdAdminId==null || scope.loggedAdminIdAdminId=='undefined'){
							scope.loggedAdminIdAdminId=0;
						}
						
						scope.sessionId=localStorage.getItem('sessionId');
						 scope.loginUserId=localStorage.getItem('loginUserId');
						 // document.getElementById('resumeFrame').src = "";
						 // var ele = angular.element('#resumeFrame');
						services.viewDownloadResume(applicationId,fileName,type,scope.sessionId,scope.loginUserId,scope.loggedAdminIdAdminId).then(function(data){
							var hostName = $location.host();
							var fileUrl;
							var FileNameToCheck = applicationId+"<->"+fileName;
						    var fileNameExt = null;
							if(type == 'A'){
								$.ajax({
							        url:RESUMEUPLAODPATH + FileNameToCheck,
							        error: function()
							        {
							           fileNameExt = applicationId+"-"+fileName;
							           fileNameExt = encodeURIComponent(fileNameExt);
									   fileUrl = RESUMEUPLAODPATH + fileNameExt; // application
																					// resumes
									   $sce.trustAsResourceUrl(fileUrl);
									  // document.getElementById('resumeFrame').src
										// =
										// 'https://docs.google.com/gview?url='+fileUrl+'&embedded=true';
									   scope.fileToView = 'https://docs.google.com/gview?url='+fileUrl+'&embedded=true';
									   // $('#viewResumeModal').modal('show');
									   scope.showModal('../common-files-v1.0/common-htmls/modal4Viewfile.html');
							        },
							        success: function()
							        {
							          fileNameExt = applicationId+"<->"+fileName;
							          fileNameExt = encodeURIComponent(fileNameExt);
									  fileUrl = RESUMEUPLAODPATH + fileNameExt; // application
																				// resumes
									  $sce.trustAsResourceUrl(fileUrl);
									 // document.getElementById('resumeFrame').src
										// =
										// 'https://docs.google.com/gview?url='+fileUrl+'&embedded=true';
									  // $('#viewResumeModal').modal('show');
									  scope.showModal('../common-files-v1.0/common-htmls/modal4Viewfile.html');
							        }
							    });
							}
							 });
						
						}*/
				
						scope.viewDownloadResume = function(applicationId,fileName,type,jobsource) {
							scope.loggedAdminIdAdminId=localStorage.getItem('loggedAdminIdAdminId');
							if(scope.loggedAdminIdAdminId==null || scope.loggedAdminIdAdminId=='undefined'){
								scope.loggedAdminIdAdminId=0;
							}
							
							scope.sessionId=localStorage.getItem('sessionId');
							 scope.loginUserId=localStorage.getItem('loginUserId');
							 
							services.viewDownloadResume(applicationId,fileName,type,scope.sessionId,scope.loginUserId,scope.loggedAdminIdAdminId).then(function(data){
								var hostName = $location.host();
								var fileUrl;
								var FileNameToCheck = applicationId+"<->"+fileName;
							    var fileNameExt = null;
								
									$.ajax({
								        url:RESUMEUPLAODPATH + FileNameToCheck,
								        error: function()
								        {
								           fileNameExt = applicationId+"-"+fileName;
								           fileNameExt = encodeURIComponent(fileNameExt);
										   fileUrl = RESUMEUPLAODPATH + fileNameExt; // application resumes
										   $sce.trustAsResourceUrl(fileUrl);
										   document.getElementById('resumeFrame').src = 'https://docs.google.com/gview?url='+fileUrl+'&embedded=true';
										   $('#viewResumeModal').modal('show');
//										   scope.fileToView = $sce.trustAsResourceUrl(fileUrl);
//										   scope.showModal('../common-files-v1.0/common-htmls/modal4Viewfile.html');
								        },
								        success: function()
								        {
								          fileNameExt = applicationId+"<->"+fileName;
								          fileNameExt = encodeURIComponent(fileNameExt);
										  fileUrl = RESUMEUPLAODPATH + fileNameExt; // application resumes
										  $sce.trustAsResourceUrl(fileUrl);
										  document.getElementById('resumeFrame').src = 'https://docs.google.com/gview?url='+fileUrl+'&embedded=true';
										  $('#viewResumeModal').modal('show');
//										  scope.fileToView = $sce.trustAsResourceUrl(fileUrl);
//										  scope.showModal('../common-files-v1.0/common-htmls/modal4Viewfile.html');
								        }
								    });				
							});
					   };
						scope.closemodal = function(){
							scope.modalInstance.close();
						}
					//## view resume ends
					scope.deleteprofile =function(id,applicantName,jobId,isFromTalentPool){
						$rootScope.applicatId=id;
						scope.sessionId = localStorage.getItem('sessionId');
						if(isFromTalentPool){
							if(jobId){
								services.checkUserPermissionToShotlistFromTalentPool(jobId,scope.sessionId,id).then(function(data){
									 if((data.data.status== true) || jobId ==-1){
										 scope.deleteProfileName = applicantName;
											scope.showModal('../common-files-v1.0/common-htmls/modal4DeleteProfile.html');									
								}else{
										 growl.error("You don't have access to this profile.");
									 }
								});
							}
						}	
						else{
							 scope.deleteProfileName = applicantName;
							 scope.showModal('../common-files-v1.0/common-htmls/modal4DeleteProfile.html');									
						}
					};
					
					scope.deleteprofilepop =function(){
						$activityIndicator.startAnimating();
						
						scope.sessionId=localStorage.getItem('sessionId');
						scope.loginUserId=localStorage.getItem('loginUserId');
						scope.loggedAdminId=localStorage.getItem('loggedAdminIdAdminId');
						if(scope.loggedAdminId==null || scope.loggedAdminId=='undefined'){
							scope.loggedAdminId=0;
						}
						scope.applicationId = $rootScope.applicatId;
						services.deleteProfile(scope.applicationId,scope.sessionId,scope.loginUserId).then(function(data){
							
							if(data.data.code==200)
							{
								//$('#DeleteProfile').modal('hide');
								scope.modalInstance.close();
								$activityIndicator.stopAnimating();
								growl.success("Profile deleted successfully");
								$route.reload();
								scope.getJobListByJobId($rootScope.jobId, scope.loginUserId, '-'); 
								services.getJob(jobId,scope.sessionId,scope.loginUserId).then(function(data){
									$rootScope.selectedJob = data.data;	
								});
							 
							}
							else
								{
							 growl.error("Something went wrong. Please try again");
							} 
						});
					}
					
					scope.cancelDeleteProfile = function(){
						scope.modalInstance.close();
					}
					
					//delete profile ends
					
					//download/request bulk profile starts
					scope.validateBlk = function(e){
						scope.validateBulk({e:e});
						
					}

					scope.calculateTotal = function(){
						if(scope.applicantListObj!=undefined && scope.applicantListObj!=null && scope.applicantListObj){
							scope.lengthOfSelectedCandidate = scope.applicantListObj.length;
							localStorage.setItem("lengthOfSelectedCandidate", scope.lengthOfSelectedCandidate );
						}
					};

					scope.bulkemailsent=false;
	 				scope.validateBulkEmailssent = function(){
						     scope.bulkemailsent=!scope.bulkemailsent;
	 						 scope.validateBulkEmailsent({bulkemailsent:scope.bulkemailsent});
	 					}
					scope.bulkdownloadresume = false;
					scope.validateResumesPresent = function(){
						scope.bulkdownloadresume = !scope.bulkdownloadresume;
						scope.validateResumePresent({bulkdownloadresume:scope.bulkdownloadresume});
					}
					//download/request bulk profile ends
					
					scope.logoutTime = localStorage.getItem('logoutTime');
					
					scope.loggedAdminId=localStorage.getItem('loggedAdminIdAdminId');	  		
					if(scope.loggedAdminId==null || scope.loggedAdminId=='undefined'){
						scope.loggedAdminId=0;
					}
					
					//bulk shortlist
					scope.applyAction = {};
					scope.showRequestBtn = true;
				    scope.isNotJoined=false;
				    scope.IsShortlistPop =true;
				    scope.applicantListObj=[];
				    scope.isBulkShortlist=false;
				    scope.shortlistRejectionNotes="";
				    scope.bulkShortlistRejectpop =function(){
				    	
						
//				    	scope.selectMoreBulkResume=null;
				    	var bulkjobId="";
				    	
//				    	scope.noOfResumes=0;
				    	
				    	/*$(".bulkDwnload:checked").each(function() 
				    	{
				    		
				    		var applicationObject = JSON.parse($(this).val());
				    		if(applicationObject.id != null)
				    			{
				    			applicationObject.sendEmailNotification = true;
				    			scope.applicantListObj.push(applicationObject);
				    				bulkjobId+="'"+applicationObject.id+"',";
				    				scope.noOfResumes++;
				    			
				    			}
				    		scope.isBulkShortlist=true;
				    		
				    	});	*/
				    	
				    	
				    	if(scope.noOfResumes !=0){
				    		 scope.bulkshortlistId=bulkjobId;
				    	}else{
				    		 growl.error("Please select atleast 1 profile to shortlist");
				    	}
				    	
				    };
				    
				    //scope.bulkActionList = ["Shortlist","Tech Screening","Not Aligned","Schedule Interview"];
				    
				 scope.isAllSelected = false;
				 scope.$watch('sessionStorageVar',function(newValue,oldValue) {
					 if(newValue!=undefined){
						 scope.appliesFilterCri = scope.appliesFilterCriJobApp;
						 if(!scope.isJob) {
							 // For the Dashboard Applies and Job Applies
								// Lists
							 var sessionStorageTemp = JSON.parse(localStorage.getItem(newValue));
							 scope.pageType = scope.sessionStorageVar + 'Tags';
						 } else {
							 var sessionStorageTemp = JSON.parse(sessionStorage.getItem(newValue));
						 }

						 scope.createSortToggle(sessionStorageTemp.appliesToBeSorted.name,sessionStorageTemp.appliesToBeSorted.isAscending);
						 if(sessionStorageTemp && sessionStorageTemp.appliesFilter 
								&& sessionStorageTemp.appliesFilter.dateFacet != undefined){
	 						 scope.appliesFilterCri.dateFacet = sessionStorageTemp.appliesFilter.dateFacet;
						 }
						 if(sessionStorageTemp && sessionStorageTemp.appliesFilter 
								&& sessionStorageTemp.appliesFilter.dateColumn != undefined){
	 						 scope.appliesFilterCri.dateColumn = sessionStorageTemp.appliesFilter.dateColumn;
						 }
						 if(sessionStorageTemp && sessionStorageTemp.appliesFilter != undefined){
						 	scope.input.anyOfTheseWords = sessionStorageTemp.appliesFilter.anyOfTheseWords;
						 	scope.selectedTagFreeText = sessionStorageTemp.appliesFilter.anyOfTheseWords;
						 }else{
						 	scope.input.anyOfTheseWords="";
						 	scope.selectedTagFreeText = "";
						 }
                        scope.currentFrameForFilter['dateColumn'] = [];
						scope.currentFrameForFilter['dateFacet'] = [];

						scope.createFilterCriteria();
						if(scope.pagePath.indexOf("/approvals") != -1){
							scope.pageType = scope.sessionStorageVar.replace('Approval','Tags');
						}
						if(sessionStorage.getItem(scope.pageType)!=null){
							   scope.selectedFilterTags = JSON.parse(sessionStorage.getItem(scope.pageType)); 
						} else{
						   sessionStorage.setItem(scope.pageType,'[]');
						   scope.selectedFilterTags = JSON.parse(sessionStorage.getItem(scope.pageType));
						}
					 }
					 
				    });   

				scope.$watch('tabScope',function(newValue,oldValue) {
					 if(newValue!=undefined){
						scope.pageScope = scope.tabScope;	 
					 }
				    });   
				    
				 
				 
				 
				 scope.bulkActionsAll = function(){
					 if(scope.isAllSelected){
						 scope.isAllSelected = false;
						 scope.applicantListObj = [];
					 }
					 else{
						 scope.isAllSelected = true;
						 scope.applicantListObj = [];
						 scope.applicantListObj = scope.applies;
					 }
					 if(scope.applicantListObj!=undefined && scope.applicantListObj!=null && scope.applicantListObj){
						scope.lengthOfSelectedCandidate = scope.applicantListObj.length;
						localStorage.setItem("lengthOfSelectedCandidate", scope.lengthOfSelectedCandidate );
					}
				 }   
				 
				 scope.bulkActionsAllApprovals = function(){
					 if(scope.isAllSelected){
						 scope.isAllSelected = false;
						 scope.applicantListObj = [];
					 }
					 else{
						 scope.isAllSelected = true;
						 scope.applicantListObj = [];
						 scope.applicantListObj = scope.applies;
						 scope.getApplicablebulkActionList();
					 }
				 }
				  
				 scope.validateBulkApprovalActions = function(){
					   var bulkjobId="";
					   scope.applicantListObj = [];
					   $(".bulkDwnload:checked").each(function() 
						    	{
						    		
						    		var applicationObject = JSON.parse($(this).val());
						    		if(applicationObject.id != null)
						    			{
						    			scope.applicantListObj.push(applicationObject);
						    				bulkjobId+="'"+applicationObject.id+"',";
						    			
						    			}
						    		scope.isBulkApprovalsAction=true;
						    		
						    		
						    	});	
					   scope.getApplicablebulkActionList();
				   }
				 	scope.showViewFitment = function(applyId)
					{
						var loginUserId = localStorage.getItem('loginUserId');
						 services.getOfferFitmentDetails(applyId,loginUserId,localStorage.getItem('sessionId'),loginUserId,"Edit").then(function(data){
								
							  scope.offerFitmentViewDetails=data.data.result;	
						  });	
						
						$('#viewFitmentModalApprovals').modal('show');
						
					};
				 
				 scope.getApplicablebulkActionList = function(){
					 scope.applicableBulkActionList=[];
					 for(var i = 0; i < scope.applicantListObj.length; i++) {
						for(var j = 0; j < scope.applicantListObj[i].nextAvailableActionLists.length; j++) {	 

							if(_.contains(scope.bulkActionList,scope.applicantListObj[i].nextAvailableActionLists[j].name)) {
								scope.applicableBulkActionList.push(scope.applicantListObj[i].nextAvailableActionLists[j].name);

							} else if(_.contains(scope.bulkActionList,scope.applicantListObj[i].nextAvailableActionLists[j].displayName)) {
								scope.applicableBulkActionList.push(scope.applicantListObj[i].nextAvailableActionLists[j].displayName);
							}
						}
					 }
					 scope.bulkActionListFinal=_.uniq(scope.applicableBulkActionList);
				 }
				 
				    scope.bulkActionList=[];
				    
				   
				    scope.performBulkAction = function(action){
						 scope.applicableCandidateForBulkAction=0;
						 scope.bulkFitmentApplyList=[];
						 for(var i=0;i<scope.applicantListObj.length;i++){
							 if(scope.applicantListObj[i].nextAvailableActionLists.length>0 && scope.applicantListObj[i].nextAvailableActionLists[0].name ==action){
								scope.applicableCandidateForBulkAction++;
								scope.bulkFitmentApplyList.push(scope.applicantListObj[i].id);
							}
						 }
						 if(scope.applicableCandidateForBulkAction==0){
							growl.error("None of the applicant is applicable for actions",{ttl:5000}); 
						 }
						 else{
							 if(scope.bulkFitmentApplyList.length >0){
								 var sessionId = localStorage.getItem('sessionId'); 
								 services.getBulkOfferActionLimit(sessionId).then(function(data){
										scope.actionLimit = data.data;
										if(scope.bulkFitmentApplyList.length >scope.actionLimit){
										   growl.error("Bulk action limit exceeded ! Maximum allowed limit is "+scope.actionLimit,{ttl:5000}); 
										}else{
										   scope.openApprovalPopup();
										}
								 });
							  }
						   }
					  };
					  
					  scope.openApprovalPopup = function (){
						    
						    scope.btnClass = "";
						    scope.approvalViewFitment = true;
						    scope.isBulkFitmentApprove=true;
						    scope.disableFinalTab=true;
						    scope.isBulkCreateFitment=true;
						    var applyId=scope.bulkFitmentApplyList[0];
							   scope.application = _.findWhere(scope.applicantListObj, {id: applyId});
							   scope.actionReq = {name: [] };
							   scope.actionReq=scope.application.nextAvailableActionLists[0];
							   scope.actionPerformed=scope.actionReq.name;
						    
						    if(scope.actionReq.name.indexOf('Approve/Reject Offer') > -1 ){
							   scope.applyObjList=scope.applicantListObj;
							   var requisites={};
								services.getListOfDataToBeCollected(scope.actionReq,requisites,scope.application.id).then(
									function (data) {									
										if(data.data.actionReadiness.isReady == true){
													scope.informationCollected = {};
													scope.infoToCollect = data.data.infoToCollect;
													scope.popupHeader = data.data.popUpHeader;
													scope.buttonName = data.data.buttonName;
													scope.isTypeUserPresent = false;
													scope.isTypeUserPresent = scope.isTypeUserPresentChecking(data.data.infoToCollect,'user');
													scope.tagadded4L1L2Approve = false;
													var modalInstance = $modal.open({
														  templateUrl: 'angular-pages/modal4OfferAndFitment.html',
														  windowClass: 'app-modal-window',
														  controller : 'fitmentAndSalaryCtrl',							 
														  scope: scope,
														  backdrop: 'static'
														});
										}
										if($location.absUrl().indexOf('fitment-approve')>-1 ){
											sessionStorage.removeItem('approvalPagePath');
						                }
								  
									}); 
						     } 
						}
					  
					  
					  scope.notSorted = function(obj){
					        if (!obj) {
					            return [];
					        }
					        return Object.keys(obj);
					    };
					  scope.isTypeUserPresentChecking = function(infoToCollect,str4check){
						 	var returnVal = false;
						     angular.forEach(infoToCollect , function(v,k){
						     	if(v.type == str4check && v.isMandatory == true){ 
						     		returnVal = true;			        		
						     	}
						     });
						     return returnVal;
						 };
				   scope.validateBulkShortlistReject = function(){
					   var bulkjobId="";
					   scope.applicantListObj = [];
					   $(".bulkDwnload:checked").each(function() 
						    	{
						    		
						    		var applicationObject = JSON.parse($(this).val());
						    		if(applicationObject.id != null)
						    			{
						    			applicationObject.sendEmailNotification = true;
						    			scope.applicantListObj.push(applicationObject);
						    				bulkjobId+="'"+applicationObject.id+"',";
						    				scope.noOfResumes++;
						    			
						    			}
						    		scope.isBulkShortlist=true;
						    		
						    		
						    	});	
				   }
				   scope.callbackForReload = function(){
					   $route.reload();
				   }
				   if(scope.pagePath.indexOf("/approvals") != -1){
					    var bulkActionCompanySpecificList = JSON.parse(localStorage.getItem('dashBoardConfigurationData'));
					    if(bulkActionCompanySpecificList!=null && bulkActionCompanySpecificList.hasOwnProperty('bulkApprovalActionList')){
						    scope.bulkActionList=bulkActionCompanySpecificList.bulkApprovalActionList;
					    }
				    }else{
				    	 var bulkActionCompanySpecificList = JSON.parse(localStorage.getItem('dashBoardConfigurationData'));
				    	 if(bulkActionCompanySpecificList!=null && bulkActionCompanySpecificList.hasOwnProperty('bulkActionList')){
							 scope.bulkActionList=bulkActionCompanySpecificList.bulkActionList;
				    	 }
				    }	
				   
				   angular.element(document).ready(function() {
						scope.loadDirectiveObj['directiveLoaded'] = true;
						if($rootScope.loadDirectiveObj) {
                                                       $rootScope.loadDirectiveObj['directiveLoaded'] = true;
                                             	}
						scope.$apply();
			        });
				   
				},
	};
}]);
