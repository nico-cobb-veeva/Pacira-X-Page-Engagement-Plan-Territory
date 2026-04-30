<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 fw-bold">
                    {{ t('AM_PENDING_SUGGESTIONS') }} ({{ pendingSuggestions.length }})
                </div>
                <div>
                    <Select label="suggestion" :options="suggestionTypes" v-model="selectedType"/>
                </div>
            </div>
        </div>
        <div class="card-body px-0 py-1" style="height: 255px;">
            <ul v-if="pendingSuggestions && pendingSuggestions.length > 0" class="list-group list-group-flush overflow-y-auto" style="height: 100%;">
                <li v-for="item of pendingSuggestions" class="list-group-item" :key="item.id">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0 suggestion-icon" :class="{'bg-urgent': item.priority === 'urgent__v'}">
                            <i v-if="item.priority === 'urgent__v'" class="fas fa-bell text-white fa-fw"></i>
                            <i v-else class="fas fa-lightbulb text-white fa-fw"></i>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <div><a href="#" class="link-underline-light"  @click="showDetail(item.id)">{{ item.title }}</a></div>
                            <div class="text-muted fs-12" style="margin-top: -0.15rem;">{{ $t('AM_POSTED') }} {{ item.postedDate }} • <a href="javascript:void(0)" class="link-underline-light"  @click="viewRecord('account__v', item.accountId)">{{ item.accountName }}</a></div>
                        </div>
                        <div class="me-2 text-center" style="width: 88px;">
                            <span v-if="item.isNew === true" class="badge text-bg-success">{{ $t('AM_NEW') }}</span>
                            <span v-else-if="item.isPastDue === true" class="badge text-bg-danger">{{ $t('AM_EXPIRING_SOON') }}</span>
                        </div>
                        <div class="flex-shrink-0">
                            <i class="fas fa-chevron-right text-primary fa-fw" @click="showDetail(item.id)"></i>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-else class="px-3 py-2">
                {{ $t('AM_NO_RECORDS') }}
            </div>
        </div>
        <Modal v-if="showModal" :show="showModal" :title="$t('AM_SUGGESTION_DETAIL')" :onClose="closeModal" size='lg'>
            <template #modal-content>
                <div class="row p-3">
                    <div class="col">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1 fs-6 text-truncate">
                                <strong>{{ selectedSuggestion.title }}</strong>
                            </div>
                            <div class="px-1">
                                <span class="badge text-bg-primary" :class="{'text-bg-danger': selectedSuggestion.priority === 'urgent__v'}">{{ capitalizeWords(selectedSuggestion.priority) }}</span>
                            </div>
                        </div>
                        <div class="fs-12 text-secondary">{{ $t('AM_POSTED') }} {{ selectedSuggestion.postedDate }} • {{ $t('AM_EXPIRATION_DATE') }} {{ selectedSuggestion.expirationDate }}</div>
                        <div class="d-flex align-items-center pt-2">
                            <div class="flex-shrink-1 me-2">
                                <img v-if="selectedSuggestion.isPerson === true" :src="require('@/assets/images/hcp.png')" class="icon-sm" alt="" />
                                <img v-else :src="require('@/assets/images/hco.png')" class="icon-sm" alt="" />
                            </div>
                            <div class="flex-grow-1">
                                <a href="javascript:void(0);" class="fs-6 link-underline-light" @click="viewRecord('account__v', selectedSuggestion.accountId)">{{ selectedSuggestion.accountName }}</a>
                            </div>
                        </div>
                        <div class="pt-2" v-html="selectedSuggestion.reason" style="white-space: pre-line;"/>
                    </div>
                </div>
            </template>
            <template #modal-footer>
                <div v-if="selectedSuggestion.objectTypeName === 'insight__v'" class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-secondary" @click="closeModal">{{ t('AM_BUTTON_CLOSE') }}</button>
                </div>
                <div v-else class="d-flex">
                    <div class="pe-2">
                        <button v-if="selectedSuggestion.displayDismiss" class="btn btn-sm btn-secondary" @click="suggestionAction(selectedSuggestion.id, 'dismiss')">{{ t('AM_BUTTON_DISMISS') }}</button>
                    </div>
                    <div class="pe-2">
                        <button v-if="selectedSuggestion.displayComplete" class="btn btn-sm btn-primary" @click="suggestionAction(selectedSuggestion.id, 'complete')">{{ t('AM_BUTTON_MARK_AS_COMPLETE') }}</button>
                    </div>
                    <div class="">
                        <button v-if="selectedSuggestion.objectTypeName === 'call__v'" class="btn btn-sm btn-success" @click="suggestionAction(selectedSuggestion.id, '')">{{ t('AM_BUTTON_SCHEDULE_CALL') }}</button>
                        <button v-else-if="selectedSuggestion.objectTypeName === 'email__v'" class="btn btn-sm btn-success" @click="suggestionAction(selectedSuggestion.id, '')">{{ t('AM_BUTTON_SEND_EMAIL') }}</button>
                        <button v-else class="btn btn-sm btn-secondary" @click="closeModal">{{ t('AM_BUTTON_CLOSE') }}</button>
                    </div>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup>
    // @ is an alias to /src
    import Select from '@/components/common/BaseSelect';
    import Modal from '@/components/common/BaseModal';
    import { computed, ref } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { useI18n } from "vue-i18n";
    import { capitalizeWords } from '@/lib/helper/commonUtils';
    import { getSuggestionInfo } from '@/lib/myInsights/index';
    import { executeSuggestionAction, viewRecord } from '@/lib/myInsights/query';
    
    // i18n ref
    const { t } = useI18n();  

    /** store getters */
    const { currUser, suggestions, parentChildAccountMap } = storeToRefs(useAppStore());
    const { setSuggestions } = useAppStore();

    const suggestionTypes = [
        { id: '#', name: t('AM_SUGGESTION_TYPE_ALL') },
        { id: 'call__v', name: t('AM_SUGGESTION_TYPE_CALL') },
        { id: 'email__v', name: t('AM_SUGGESTION_TYPE_EMAIL') },
        { id: 'insight__v', name: t('AM_SUGGESTION_TYPE_INSIGHT') }
    ];
    const selectedType = ref('#');
    const selectedSuggestion = ref(null);
    const showModal = ref(false);

    /** computed properties */
    const pendingSuggestions = computed(() => {
        let retList = [];
        if(suggestions.value && suggestions.value.length > 0) {
            if(selectedType.value !== '#') {
                retList = suggestions.value.filter(s => s.objectTypeName === selectedType.value);
            } else {
                retList = [...suggestions.value];
            }
        }
        return retList;
    });

    /** methods */
    const showDetail = (suggestionId) => {
        selectedSuggestion.value = suggestions.value.find(item => item.id === suggestionId);
        showModal.value = true;
    };
    const closeModal = () => {
        selectedSuggestion.value = null;
        showModal.value = false;
    };
    const suggestionAction = (suggestionId, actionType) => {
        closeModal();
        // execute suggestion action
        executeSuggestionAction(suggestionId, actionType)
        .then(function(resp) {
            // success callback
            if(resp && resp.success) {
                // When action occurs, get the new list of suggestion
                getSuggestionInfo(parentChildAccountMap.value)
                .then(suggestionResp => {
                    setSuggestions(suggestionResp);
                });
            } else {
                // The operation is canceled
            }
        }, error => {
            console.log(error.message);
        });
    };
</script>

<style scoped>
    .list-group-item { 
        padding: 0.28rem 0.9rem;
    }
    .suggestion-icon {
        background-color: #c3bfb8;
        border-color: #eee;
        border-radius: 4px;
        height: 1.8rem;
        width: 1.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bg-normal {
        background-color: #197ed6;
    }
    .bg-urgent {
        background-color: #EA4335;
    }
</style>
