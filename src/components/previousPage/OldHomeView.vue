<template>
	<div class="container-fluid py-2 px-2">
		<Toast :show="hasNotification" :data="getNotification"/>
		<div class="row">
			<div class="col">
				<ProfileDetail :calls="myCalls.totalCalls" />
			</div>
		</div>
		<div class="row pt-2 gx-2">
			<div class="col">
				<div class="card border-warning border-2 bg-body-tertiary">
					<div class="card-body row gx-2 p-2">
						<div class="col">
							<KpiCmp :title="$t('AM_TOTAL_CALLS')" :subTitle="'('+dateRangeName+')'" :value="myCalls.totalCalls">
								<template #action>
									<span>{{ $t('AM_LAST_CALL') }}:&nbsp;
										<a v-if="myCalls.totalCalls > 0" href="javascript:void(0)" class="link-underline-light" @click="viewRecord('call2__v', myCalls.lastCallId)">
											{{ myCalls.lastCallDate }}
										</a>
										<span v-else>{{ myCalls.lastCallDate }}</span>
									</span>
								</template>
							</KpiCmp>
						</div>
						<div class="col">
							<KpiCmp :title="$t('AM_TOTAL_ATTENDEES')" :subTitle="'('+dateRangeName+')'" :value="myCalls.totalAttendees">
								<template #action>
									<span>{{ myCalls.avgAttendeesPerCall }}</span>
								</template>
							</KpiCmp>
						</div>
						<div class="col">
							<KpiCmp :title="$t('AM_CALLS_W_CLM')" :subTitle="'('+dateRangeName+')'" :value="myCalls.totalClmCalls">
								<template #action>
									<span>{{ $t('AM_LAST_CALL') }}:&nbsp;
										<a v-if="myCalls.totalClmCalls > 0" href="javascript:void(0)" class="link-underline-light" @click="viewRecord('call2__v', myCalls.lastClmCallId)">
											{{ myCalls.lastClmCallDate }}
										</a>
										<span v-else>{{ myCalls.lastClmCallDate }}</span>
									</span>
								</template>
							</KpiCmp>
						</div>
					</div>
				</div>
			</div>
			<div class="col">
				<div class="card border-info border-2 bg-body-tertiary">
					<div class="card-body row gx-2 p-2">
						<div class="col">
							<KpiCmp :title="$t('AM_TOTAL_SENT_EMAILS')" :subTitle="'('+dateRangeName+')'" :value="mySentEmails.totalSent">
								<template #action>
									<span>{{ $t('AM_LAST_SENT') }}:&nbsp;
										<a v-if="mySentEmails.totalSent > 0" href="#" class="link-underline-light" @click="viewRecord('sent_email__v', mySentEmails.lastSentEmailId)">
											{{ mySentEmails.lastEmailSentDate }}
										</a>
										<span v-else>{{ mySentEmails.lastEmailSentDate }}</span>
									</span>
								</template>
							</KpiCmp>
						</div>
						<div class="col">
							<KpiCmp :title="$t('AM_EMAIL_CLICKED_RATE')" :subTitle="'('+dateRangeName+')'" :value="mySentEmails.emailClickePct">
								<template #action>
									<span>{{ $t('AM_LAST_CLICKED') }}:&nbsp;
										<a v-if="mySentEmails.totalEmailClicked > 0" href="#" class="link-underline-light" @click="viewRecord('sent_email__v', mySentEmails.lastClickedEmailId)">
											{{ mySentEmails.lastClickedDate }}
										</a>
										<span v-else>{{ mySentEmails.lastClickedDate }}</span>
									</span>
								</template>
							</KpiCmp>
						</div>
						<div class="col">
							<KpiCmp :title="$t('AM_PENDING_SUGGESTIONS')" :subTitle="'('+dateRangeName+')'" :value="pendingSuggestions.length">
								<template #action>
									<span v-if="pendingSuggestions.length > 0">{{ $t('AM_MOST_RECENT') }}:&nbsp;{{ pendingSuggestions[0].postedDate }}</span>
									<span v-else>{{ $t('AM_MOST_RECENT') }}:&nbsp; --</span>
								</template>
							</KpiCmp>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="accountPlan.id !== ''" class="row pt-2">
			<div class="col">
				<EngagementPlan />
			</div>
		</div>
		<div class="row pt-2 gx-2">
			<div class="col">
				<ActivityTimeline />
			</div>
			<div class="col">
				<PendingSuggestions />
			</div>
		</div>
	</div>
</template>

<script setup>
	// @ is an alias to /src
	import ProfileDetail from '@/components/ProfileDetail';
	import KpiCmp from '@/components/KpiCmp';
	import EngagementPlan from '@/components/EngagementPlan';
	import ActivityTimeline from '@/components/ActivityTimeline'; 
	import PendingSuggestions from '@/components/PendingSuggestions'; 
	import Toast from '@/components/common/BaseToast';
	import { computed } from 'vue';
	import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { viewRecord } from '@/lib/myInsights/query';
    import { NO_DATA, SYSTEM_DATE_FORMAT } from '@/lib/helper/constants';
    import { formatStr } from '@/lib/helper/commonUtils';
    import Moment from 'moment';
    import { useI18n } from "vue-i18n";

    // i18n ref
    const { t } = useI18n(); 

	/** store getters */
    const { currUser, calls, sentEmails, suggestions, hasNotification, getNotification, selectedDateRange, accountPlan } = storeToRefs(useAppStore());

    /** computed properties */
    // calls kpi
    const myCalls = computed(() => {
    	let retObj = {
    		totalCalls: 0,
    		lastCallDate: NO_DATA,
    		lastCallId: '',
    		totalClmCalls: 0,
    		lastClmCallDate: NO_DATA,
    		lastClmCallId: '',
    		totalAttendees: 0,
    		avgAttendeesPerCall: NO_DATA
    	};
    	if(calls.value && calls.value.length > 0) {
    		const today = Moment().format(SYSTEM_DATE_FORMAT);
    		let tempCalls = [];
    		if(selectedDateRange.value == 'thirtyDays') {
    			const thirtyDaysAgo = Moment().subtract(30, "days").format(SYSTEM_DATE_FORMAT);
    			tempCalls = calls.value.filter(c => c.ownerId === currUser.value.id && Moment(c.systemDate).isBetween(thirtyDaysAgo, today, null, '[]'));
    		} if(selectedDateRange.value == 'sixtyDays') {
    			const sixtyDaysAgo = Moment().subtract(60, "days").format(SYSTEM_DATE_FORMAT);
    			tempCalls = calls.value.filter(c => c.ownerId === currUser.value.id && Moment(c.systemDate).isBetween(sixtyDaysAgo, today, null, '[]'));
    		} else {
    			tempCalls = calls.value.filter(c => c.ownerId === currUser.value.id);
    		}
    		if(tempCalls && tempCalls.length > 0) {
    			// total calls
    			retObj.totalCalls = tempCalls.length;
    			retObj.lastCallDate = tempCalls[0].displayDate;
    			retObj.lastCallId = tempCalls[0].id;

    			// clm calls
    			tempCalls.forEach(c => {
    				if(c.isCLM === true) {
    					retObj.totalClmCalls++;
    					if(retObj.lastClmCallDate === NO_DATA) {
    						retObj.lastClmCallDate = c.displayDate;
    						retObj.lastClmCallId = c.id;
    					}
    				}
    				retObj.totalAttendees += c.numAttendees;
    			});

    			if(retObj.totalAttendees > 0) {
    				retObj.avgAttendeesPerCall = formatStr('Avg. {0} Attendees per call', Math.round(retObj.totalAttendees/tempCalls.length));
    			}

    			// calls with channel email
    			let callsWithEmail = tempCalls.filter(c => c.isChannelEmail === true);
    			if(callsWithEmail && callsWithEmail.length > 0) {
    				retObj.totalCallWithEmail = callsWithEmail.length;
    				retObj.lastCallWithEmailDate = callsWithEmail[0].displayDate;
    				retObj.lastCallWithEmailId = callsWithEmail[0].id;
    			}
    		}
    	}	
    	return retObj;
    });

    // sent emails kpi
    const mySentEmails = computed(() => {
    	let retObj = {
    		totalSent: 0,
    		lastEmailSentDate: NO_DATA,
    		lastSentEmailId: '',
    		totalEmailClicked: 0,
    		emailClickePct: '0%',
    		lastClickedDate: NO_DATA,
    		lastClickedEmailId: ''
    	};
    	if(sentEmails.value && sentEmails.value.length > 0) {
    		const today = Moment().format(SYSTEM_DATE_FORMAT);
    		let tempList = sentEmails.value.filter(se => se.ownerId === currUser.value.id);
    		if(selectedDateRange.value == 'thirtyDays') {
    			const thirtyDaysAgo = Moment().subtract(30, "days").format(SYSTEM_DATE_FORMAT);
    			tempList = sentEmails.value.filter(se => se.ownerId === currUser.value.id && Moment(se.systemDate).isBetween(thirtyDaysAgo, today, null, '[]'));
    		} if(selectedDateRange.value == 'sixtyDays') {
    			const sixtyDaysAgo = Moment().subtract(60, "days").format(SYSTEM_DATE_FORMAT);
    			tempList = sentEmails.value.filter(se => se.ownerId === currUser.value.id && Moment(se.systemDate).isBetween(sixtyDaysAgo, today, null, '[]'));
    		} else {
    			tempList = sentEmails.value.filter(se => se.ownerId === currUser.value.id);
    		}
    		if(tempList && tempList.length > 0) {
    			// total sent email
    			retObj.totalSent = tempList.length;
    			retObj.lastEmailSentDate = tempList[0].displayDate;
    			retObj.lastSentEmailId = tempList[0].id;

    			// compute clicked percentage
    			const clickedEmails = tempList.filter(se => se.clicked === true);
    			if(clickedEmails && clickedEmails.length > 0) {
    				retObj.totalEmailClicked = clickedEmails.length;
    				retObj.emailClickePct = ((clickedEmails.length/tempList.length)*100).toFixed(1) + '%';
    				retObj.lastClickedDate = clickedEmails[0].lastClicked;
    				retObj.lastClickedEmailId = clickedEmails[0].id;
    			}
    		}
    	}
    	return retObj;
    });

    // pending suggestion kpi
    const pendingSuggestions = computed(() => {
    	let retList = [];
    	if(suggestions.value && suggestions.value.length > 0) {
    		const today = Moment().format(SYSTEM_DATE_FORMAT);
    		if(selectedDateRange.value == 'thirtyDays') {
    			const thirtyDaysAgo = Moment().subtract(30, "days").format(SYSTEM_DATE_FORMAT);
    			retList = suggestions.value.filter(s => Moment(s.postedSystemDate).isBetween(thirtyDaysAgo, today, null, '[]'));
    		} else if(selectedDateRange.value == 'sixtyDays') {
    			const sixtyDaysAgo = Moment().subtract(60, "days").format(SYSTEM_DATE_FORMAT);
    			retList = suggestions.value.filter(s => Moment(s.postedSystemDate).isBetween(sixtyDaysAgo, today, null, '[]'));
    		} else {
    			retList = [...suggestions.value];
    		}
    	}
    	return retList;
    });

    const dateRangeName = computed(() => {
    	let retVal = '';
    	if(selectedDateRange.value) {
    		if(selectedDateRange.value === 'thirtyDays') {
    			retVal = formatStr('Last {0} days', 30);
    		} else if(selectedDateRange.value === 'sixtyDays') {
    			retVal = formatStr('Last {0} days', 60);
    		} else {
    			retVal = formatStr('Last {0} days', 90);
    		}
    	}
    	return retVal;
    });
</script>

<style>
	.border-brand {
		border-color: #f7891d !important;
	}
	.fa-md {
		height: 24px;
		width: 24px;
	}
	.fs-12 {
		font-size: 12px;
	}
	.icon-md {
		height: 32px;
		width: 32px;
	}
	.icon-sm {
		height: 26px;
		width: 26px;
	}
	.icon-xs {
		height: 18px;
		width: 18px;
	}
</style>
