<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex align-items-center">
                <div class="flex-grow-1 fw-bold">
                    {{ t('AM_PROFILE_DETAILS') }}
                </div>
                <div class="me-2">
                    <Select label="dateFilter" :options="dateRangeOptions" v-model="selectedDateRange"/>
                </div>
                <div>
                    <a class="btn btn-outline-primary btn-sm" :href="powerBiUrl" role="button" target="_blank" rel="noopener noreferrer">{{ $t('AM_POWER_BI') }}</a>
                </div>
            </div>
        </div>
        <div class="card-body pb-0">
            <div class="row gx-6">
                <div class="col-9">
                    <div class="row">
                        <div class="col-4">
                            <div>
                                <label for="primaryParent" class="form-label">{{ $t('AM_PRIMARY_PARENT') }}</label>
                                <p id="parent" v-if="currAccount.parentId"><a href="javascript:void(0);" class="link-underline-light" @click="viewRecord('account__v', currAccount.parentId)">{{ currAccount.parentName }}</a></p>
                                <p id="parent" v-else>{{ currAccount.parentName }} </p>
                            </div>
                            <div>
                                <label for="idn" class="form-label">{{ $t('AM_IDN') }}</label>
                                <p id="idn">{{ currAccount.idnName }} </p>
                            </div>
                            <div>
                                <label for="address" class="form-label">{{ $t('AM_PRIMARY_ADDRESS') }}</label>
                                <p id="address" class="mb-0">{{ currAccount.address }}</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div>
                                <label for="hcoType" class="form-label">{{ $t('AM_HCO_TYPE') }}</label>
                                <p id="hcoType">{{ currAccount.hcoType }} </p>
                            </div>
                            <div>
                                <label for="gpo" class="form-label">{{ $t('AM_PRIMARY_GPO') }}</label>
                                <p id="gpo">{{ currAccount.gpoName }} </p>
                            </div>
                            <div>
                                <label for="phone" class="form-label">{{ $t('AM_PHONE') }}</label>
                                <p id="phone" class="mb-0">{{ currAccount.phoneNo }} </p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div>
                                <label for="website" class="form-label">{{ $t('AM_WEBSITE') }}</label>
                                <p id="website"><a :href="currAccount.website" class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" target="_blank">{{ currAccount.website }}</a></p>
                            </div>
                            <div>
                                <label for="doNotCall" class="form-label">{{ $t('AM_DO_NOT_CALL') }}</label>
                                <p id="doNotCall" class="mb-0">{{ currAccount.doNotCall }}</p>
                            </div>
                                <!-- <label for="productPromoRestrictions" class="form-label">{{ $t('AM_PRODUCT_PROMO_RESTRICTIONS') }}</label>
                                <p id="productPromoRestrictions">{{ currAccount.productPromoRestrictions }}</p>
                            </div>
                            <div>
                                <label for="sampleRestrictions" class="form-label">{{ $t('AM_SAMPLING_RESTRICTIONS') }}</label>
                                <p id="sampleRestrictions" class="mb-0">{{ currAccount.sampleRestrictions }}</p>
                            </div> -->
                        </div>
                    </div>
                </div>
                <div class="col-3">
                    <div v-if="currTerritoryType.type == TEAM_OMFS ">
                        <div class="mb-3">
                            <label class="form-label">{{ $t('AM_SALES') }}</label>
                            <div class="border rounded overflow-hidden">
                                <nav class="nav nav-pills nav-justified flex-nowrap">
                                    <a class="nav-link px-1 no-border-radius border-end" href="javascript:void(0)" :class="{'active': selectedSales === 'Direct'}" @click.prevent="selectedSales = 'Direct'"><span>{{ $t('AM_SALES_DIRECT') }}</span></a>
                                    <a class="nav-link px-1 no-border-radius border-end" href="javascript:void(0)" :class="{'active': selectedSales === 'Contracted'}" @click.prevent="selectedSales = 'Contracted'"><span>{{ $t('AM_SALES_CONTRACTED') }}</span></a>
                                    <a class="nav-link px-1 no-border-radius" href="javascript:void(0)" :class="{'active': selectedSales === 'Mixed'}" @click.prevent="selectedSales = 'Mixed'"><span>{{ $t('AM_SALES_MIXED') }}</span></a>
                                </nav>
                            </div>
                        </div>
                        <div>
                            <label class="form-label">{{ $t('AM_STRATEGY') }}</label>
                            <div class="border rounded overflow-hidden">
                                <nav class="nav nav-pills nav-justified">
                                    <a class="nav-link no-border-radius border-end" href="javascript:void(0)" :class="{'active': selectedStrategy === 'Opt-In'}" @click.prevent="selectedStrategy = 'Opt-In'"><span>{{ $t('AM_STRATEGY_OPT_IN') }}</span></a>
                                    <a class="nav-link no-border-radius" href="javascript:void(0)" :class="{'active': selectedStrategy === 'Opt-Out'}" @click.prevent="selectedStrategy = 'Opt-Out'"><span>{{ $t('AM_STRATEGY_OPT_OUT') }}</span></a>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="currTerritoryType.type == TEAM_ZILRETTA">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-body-secondary">{{ $t('AM_ZILRETTA_PRIORITY') }}</th>
                                    <th scope="col" class="text-body-secondary">{{ currAccount.zilrettaPriority}}</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                <tr>
                                    <th scope="row">Required calls in last 30 days:</th>
                                    <td v-if="currAccount.zilrettaPriority == 'High'">{{ calls }}/{{ZILRETTA_HIGH_PRIORITY}}</td>
                                    <td v-else-if="currAccount.zilrettaPriority == 'Medium'">{{ calls }}/{{ZILRETTA_MEDIUM_PRIORITY}}</td>
                                    <td v-else>{{ calls }}/{{ZILRETTA_LOW_PRIORITY}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else-if="currTerritoryType.type == TEAM_EXPAREL">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-body-secondary">{{ $t('AM_EXPAREL_PRIORITY') }}</th>
                                    <th scope="col" class="text-body-secondary">{{ currAccount.exparelPriority}}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div v-else-if="currTerritoryType.type == TEAM_IOVERA">
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-body-secondary">{{ $t('AM_IOVERA_PRIORITY') }}</th>
                                    <th scope="col" class="text-body-secondary">{{ currAccount.ioveraPriority}}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // @ is an alias to /src
    import Select from '@/components/common/BaseSelect';
    import { computed, ref, defineProps } from 'vue';
    import { useAppStore } from '@/store/app';
    import { storeToRefs } from 'pinia';
    import { useI18n } from "vue-i18n";
    import { formatStr } from '@/lib/helper/commonUtils';
    import { viewRecord } from '@/lib/myInsights/query';
    import { TEAM_OMFS, TEAM_ZILRETTA, ZILRETTA_HIGH_PRIORITY, ZILRETTA_MEDIUM_PRIORITY, ZILRETTA_LOW_PRIORITY, TEAM_EXPAREL, TEAM_IOVERA} from '@/lib/helper/constants';
    
    // i18n ref
    const { t } = useI18n(); 

    const powerBiUrl = t('AM_POWER_BI_URL');
    
    // props
    const props = defineProps({
        calls: [String, Number]
    });

    // local props
    const selectedSales = ref(null);
    const selectedStrategy = ref(null);

    /** store getters */
    const { currAccount, selectedDateRange, currTerritoryType } = storeToRefs(useAppStore());
    const terrType = currTerritoryType.value.type;

    // date range options
    const dateRangeOptions = computed(() => {
        return [{ id: 'thirtyDays', name: formatStr('{0} Days', 30) },
                { id: 'sixtyDays', name: formatStr('{0} Days', 60) },
                { id: 'ninetyDays', name: formatStr('{0} Days', 90) }];
    });
</script>

<style scoped>
	.no-border-radius {
		border-top-right-radius: 0 !important;
  		border-bottom-right-radius: 0 !important;
  		border-top-left-radius: 0 !important;
  		border-bottom-left-radius: 0 !important;
	}
	.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    	background-color: #2e5daa;
    }
</style>
