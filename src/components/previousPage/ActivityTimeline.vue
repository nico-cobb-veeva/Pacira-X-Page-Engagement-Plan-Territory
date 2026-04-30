<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 fw-bold">
                    {{ t('AM_ACTIVITY_TIMELINE') }} ({{ allActivities.length }})
                </div>
                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradioMy" autocomplete="off" :checked="!showAll" v-on:change="handleToggle">
                    <label class="btn btn-outline-primary btn-sm" for="btnradioMy">{{ $t('AM_MY') }}</label>

                    <input type="radio" class="btn-check" name="btnradio" id="btnradioAll" autocomplete="off" :checked="showAll" v-on:change="handleToggle">
                    <label class="btn btn-outline-primary btn-sm" for="btnradioAll">{{ $t('AM_ALL') }}</label>
                </div>
            </div>
        </div>
        <div class="card-body px-3 py-2" style="height: 255px;">
            <section v-if="allActivities && allActivities.length > 0" class="overflow-y-auto" style="height: 100%;">
                <ul class="timeline-with-icons">
                    <li v-for="item of allActivities" class="timeline-item mb-3" :key="item.id">
                        <span class="timeline-icon">
                            <i v-if="item.linkObject == 'call2__v'" class="fas fa-handshake text-primary fa-lg fa-fw"></i>
                            <i v-else-if="item.linkObject == 'sent_email__v'" class="fas fa-envelope text-primary fa-lg fa-fw"></i>
                            <i v-else-if="item.linkObject == 'medical_event__v'" class="fas fa-calendar-days text-primary fa-lg fa-fw"></i>
                        </span>
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <a href="javascript:void(0)" class="link-underline-light" @click="viewRecord(item.linkObject, item.id)">{{ item.description }}</a>
                            </div>
                            <div class="mx-2">
                                <span class="badge text-bg-light">{{ item.ownerType }}</span>
                            </div>
                            <div>
                                <span class="">{{ item.displayDate }}</span>
                            </div>
                        </div>
                        <p class="text-muted mb-2">{{ item.product }} • <strong>{{ $t('AM_OWNER') }}</strong>: {{ item.ownerName }}</p>
                    </li>
                </ul>
            </section>
            <div v-else class="p-2">
                {{ $t('AM_NO_RECORDS') }}
            </div>
        </div>
    </div>
</template>

<script setup>
    // @ is an alias to /src
    import { computed, ref } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { useI18n } from "vue-i18n";
    import { viewRecord } from '@/lib/myInsights/query';
    
    // i18n ref
    const { t } = useI18n();  

    /** store getters */
    const { currUser, calls, sentEmails, medicalEvents } = storeToRefs(useAppStore());

    const showAll = ref(true);

    /** computed properties */
    // computes list of all activities
    const allActivities = computed(() => {
        let retList = [];
        // merge all the activities
        if(calls.value && calls.value.length > 0) {
            retList = [...calls.value];
        }
        if(sentEmails.value && sentEmails.value.length > 0) {
            retList = [...retList, ...sentEmails.value];
        }
        if(medicalEvents.value && medicalEvents.value.length > 0) {
            retList = [...retList, ...medicalEvents.value];
        }
        
        // sort, apply owner filter
        if(retList && retList.length > 0) {
            // apply owner filter
            if(!showAll.value) {
                retList = retList.filter(item => item.ownerId === currUser.value.id);
            } 

            // sort
            retList = retList.sort((a, b) => {
                const aDate = new Date(a.systemDate);
                const bDate = new Date(b.systemDate);
                return (aDate < bDate) ? 1 : (aDate > bDate) ? -1 : 0;
            });
        }
        return retList;
    });

    /** methods */
    const handleToggle = () => {
        showAll.value = !showAll.value;
    };
</script>

<style scoped>
    .timeline-with-icons {
        border-left: 1px solid hsl(0, 0%, 90%);
        position: relative;
        list-style: none;
        margin-left: 0.9rem;
    }

    .timeline-with-icons .timeline-item {
        position: relative;
    }

    .timeline-with-icons .timeline-item:after {
        position: absolute;
        display: block;
        top: 0;
    }

    .timeline-with-icons .timeline-icon {
        position: absolute;
        left: -48px;
        background-color: #e2ecfc;
        color: #e2ecfc;
        border-radius: 50%;
        height: 2rem;
        width: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
