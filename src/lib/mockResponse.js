export const getDataForCurrentObject = {
    user__sys: {
        user__sys: {
            locale_code__v: "en_US",
            id: "20079859",
        },
        success: true,
    },
    account__v: {
        account__v: {
            id: "V4T000000001001",
        },
        success: true,
    },
    territory__v: {
        territory__v: {
            id: "VCRZ025E82GT3C0",
            name__v: "i_10101ES"
        },
        success: true,
    }
};

export const getObjectTypes = {
    account__v: {
        account__v: [
            {
                "label": "Professional",
                "name": "professional__v",
                "id": "OOT00000000V301",
                "isActive": true,
            },
            {
                "label": "Institution",
                "name": "institution__v",
                "id": "OOT00000000V302",
                "isActive": true,
            },
            {
                "label": "Practice",
                "name": "practice__v",
                "id": "OOT00000000V303",
                "isActive": true,
            }
        ]
    },
    call2__v: {
        call2__v: [
            {
                "label": "Call Report",
                "name": "callreport__v",
                "id": "OOT00000000V304",
                "isActive": true,
            },
            {
                "label": "Engage Connect",
                "name": "engage_connect__v",
                "id": "OOT00000000V305",
                "isActive": true,
            }
        ]
    }
};

export const runQuery = {
    user__sys: {
        data: [{
            id: {
                dataType: "string",
                label: "ID",
                display: "20079859",
                value: "20079859",
            },
            name__v: {
                dataType: "string",
                label: "Name",
                display: "Sarah Jones",
                value: "Sarah Jones",
            },
            locale_code__v: {
                dataType: "string",
                label: "Locale Code",
                display: "en_US",
                value: "en_US",
            },
        }],
        object: {
            plural: "Users",
            singular: "User",
            name: "user__sys",
        },
        name: "user__sys",
        fieldLabels: [
            {
                name: "id",
                display: "ID",
            },
            {
                name: "name__v",
                display: "Name",
            },
            {
                name: "locale_code__v",
                display: "Locale Code",
            },
        ],
    } 
};

export const getAvailableObjects = () => {
    return {
        success: true,
        data: {
            user__sys: {},
            account__v: {},
            suggestion__v: {},
            account_plan__v: {},
            plan_tactic__v: {},
            account_tactic__v: {},
            action_item__v: {},
            key_stakeholder__v: {},
            event_attendee__v: {},
            medical_event__v: {},
            xpage_analytics__c: {}
        },
        record_count: 8,
    };
};

export const getObjectMetadata = {
    account__v: {
        success: true,
        data: {
            object: "account__v",
            fields: [
                {
                    name: "Id",
                    dataType: "string",
                },
                {
                    name: "name__v",
                    dataType: "string",
                },
            ],
        },
        record_count: 2,
    },
};

export const queryRecord = {
    user__sys: {
        user__sys: [
            {
                id: "20079859",
                name__v: 'Michelle Parker',
                profile_name__v: "1 - Pacira - Sales",
                user_type__v: "sales__v"
            },
            {
                id: "20079860",
                name__v: 'Steven Strange',
                profile_name__v: "1 - Pacira - Sales",
                user_type__v: "medical__v"
            },
            {
                id: "20079861",
                name__v: 'Peter Parker',
                profile_name__v: "1 - Pacira - Sales",
                user_type__v: "marketing__v"
            }
        ]
    },
    user_territory__v: {
        user_territory__v: [
            {
                territory__v: 'terr1'
            }
        ]
    },
    territory__v: {
        territory__v: [
            {
                name__v: 'S1000200'
            }
        ]
    },
    account__v: {
        account__v: [
            {
                id: "V4T000000001000",
                name__v: "Chilton Hospital",
                ispersonaccount__v: 0,
                specialty_1__v: null,
                business_title__c: null,
                formatted_name__v: "Chilton Hospital",
                pacira_primary_parent_name__c: "Northwestern Hospital",
                primary_parent__v: "V4T000000002000",
                pac_exparel_priority__c: "medium__c",
                pac_zilretta_priority__c: "high__c",
                pac_iovera_priority__c: null,
                net_hco_type__c: 'ho__v',
                pacira_idn__c: 'Adena Health System',
                website_cda__v: 'https://www.adena.org/locations/adena-regional-medical-center',
                office_phone_cda__v: '(740) 779-7500',
                primary_gpo__c: 'Community Health Alliance'
            }, {
                id: "V4T000000001001",
                name__v: "Christopher Wu",
                ispersonaccount__v: 1,
                specialty_1__v: "dm__v",
                formatted_name__v: "Wu, Christopher",
                pacira_primary_parent_name__c: "Chilton Hospital",
                primary_parent__v: "V4T000000001000",
                pac_exparel_priority__c: "null",
                business_title__c: "education_nurse__c",
                pac_zilretta_priority__c: "low__c",
                pac_iovera_priority__c: "low__c",
                net_hco_type__c: null,
                pacira_idn__c: null,
                website_cda__v: null,
                office_phone_cda__v: '7407797500',
                primary_gpo__c: null
            }, {
                id: "V4T000000001002",
                name__v: "John Smith",
                ispersonaccount__v: 1,
                specialty_1__v: "imic__v",
                formatted_name__v: "Smith, John",
                pacira_primary_parent_name__c: "Chilton Hospital",
                primary_parent__v: "V4T000000001000",
                pac_exparel_priority__c: "medium__c",
                business_title__c: "clinical_pharmacist__c",
                pac_zilretta_priority__c: "low__c",
                pac_iovera_priority__c: "null",
                net_hco_type__c: null,
                pacira_idn__c: null,
                website_cda__v: null,
                office_phone_cda__v: '7407797500',
                primary_gpo__c: null
            }, {
                id: "V4T000000001003",
                name__v: "Clinton Ackerman",
                ispersonaccount__v: 1,
                specialty_1__v: "cd__v",
                formatted_name__v: "Ackerman, Clinton",
                pacira_primary_parent_name__c: "Chilton Hospital",
                primary_parent__v: "V4T000000001000",
                pac_exparel_priority__c: "high__c",
                business_title__c: "billing_manager__c",
                pac_zilretta_priority__c: "medium__c",
                pac_iovera_priority__c: "medium__c",
                net_hco_type__c: null,
                pacira_idn__c: null,
                website_cda__v: null,
                office_phone_cda__v: '7407797500',
                primary_gpo__c: null
            }, {
                id: "V4T000000001004",
                name__v: "Arielle Duplessy",
                ispersonaccount__v: 1,
                specialty_1__v: "cd__v",
                formatted_name__v: "Duplessy, Arielle",
                pacira_primary_parent_name__c: "Northwestern Hospital",
                primary_parent__v: "V4T000000001000",
                pac_exparel_priority__c: "high__c",
                business_title__c: "administrator__c",
                pac_zilretta_priority__c: null,
                pac_iovera_priority__c: "medium__c",
                net_hco_type__c: null,
                pacira_idn__c: null,
                website_cda__v: null,
                office_phone_cda__v: '7407797500',
                primary_gpo__c: null
            }
        ],
        "success":true,
        "record_count":6
    },
    address__v: {
        address__v: [{
            id: "V56Z06G6OIATMH3",
            account__v: "V4T000000002000",
            name__v: '1234 Walkers Lane',
            street_address_2_cda__v: null,
            city_cda__v: "Duluth",
            state_province__v: "ga__v",
            postal_code_cda__v: "30096",
            country__v: "United States",
            pcr_full_address_cnx__c: '1234 Walkers Lane, Duluth, GA 30096'
        }, {
            id: "V56Z06G6OIAIJK1",
            account__v: "V4T000000001000",
            name__v: '1111 Crater Lake Ave',
            street_address_2_cda__v: null,
            city_cda__v: "Arcadia",
            state_province__v: "ca__v",
            postal_code_cda__v: "94598",
            country__v: "United States",
            pcr_full_address_cnx__c: '1111 Crater Lake Ave, Arcadia, CA 94598'
        }, {
            id: "V56Z06G6OIAPQR2",
            account__v: "V4T000000001001",
            name__v: '645 S Central Ave',
            street_address_2_cda__v: null,
            city_cda__v: "Harbor City",
            state_province__v: "ca__v",
            postal_code_cda__v: "90710",
            country__v: "United States",
            pcr_full_address_cnx__c: '645 S Central Ave, Harbor City, CA 90710'
        }, {
            id: "V56Z06G6OIALMN4",
            account__v: "V4T000000001002",
            name__v: '10666 N Torrey Pines Rd',
            street_address_2_cda__v: null,
            city_cda__v: "Walnut Creek",
            state_province__v: "ca__v",
            postal_code_cda__v: "90710",
            country__v: "United States",
            pcr_full_address_cnx__c: '10666 N Torrey Pines Rd, Walnut Creek, CA 90710'
        }, {
            id: "V56Z06G6OIADCR5",
            account__v: "V4T000000001003",
            name__v: '9333 Imperial Hwy',
            street_address_2_cda__v: null,
            city_cda__v: "Downey",
            state_province__v: "ca__v",
            postal_code_cda__v: "90242",
            country__v: "United States",
            pcr_full_address_cnx__c: '9333 Imperial Hwy, Downey, CA 90242'
        }],
        "success":true,
        "record_count":5
    },
    call2__v: {
        call2__v: [{
            id: "c1",
            call_date__v: "2025-10-08",
            account__v: "V4T000000001000",
            clm__v: 1,
            ownerid__v: '20079859',
            detailed_products__v: 'EXPAREL',
            activity_type__c: 'face_to_face__c',
            parent_call__v: 'c1'
        }, {
            id: "c2",
            call_date__v: "2025-10-01",
            account__v: "V4T000000001000",
            clm__v: 0,
            ownerid__v: '20079859',
            detailed_products__v: 'EXPAREL',
            activity_type__c: 'general_meeting__c',
            parent_call__v: 'c1'
        }, {
            id: "c3",
            call_date__v: "2025-09-30",
            account__v: "V4T000000001000",
            clm__v: 1,
            ownerid__v: '20079860',
            detailed_products__v: 'ZILRETTA',
            activity_type__c: 'general_meeting__c',
            parent_call__v: 'c2'
        }, {
            id: "c4",
            call_date__v: "2025-09-27",
            account__v: "V4T000000001000",
            clm__v: 0,
            ownerid__v: '20079859',
            detailed_products__v: 'Iovera',
            activity_type__c: 'sales_rep_support__c',
            parent_call__v: 'c2'
        }, {
            id: "c5",
            call_date__v: "2025-09-20",
            account__v: "V4T000000001000",
            clm__v: 0,
            ownerid__v: '20079860',
            detailed_products__v: 'EXPAREL',
            activity_type__c: 'general_meeting__c',
            parent_call__v: 'c5'
        }, {
            id: "c6",
            call_date__v: "2025-09-15",
            account__v: "V4T000000001000",
            clm__v: 0,
            ownerid__v: '20079859',
            detailed_products__v: 'ZILRETTA',
            activity_type__c: 'scientific_exchange__c',
            parent_call__v: 'c3'
        }, {
            id: "c7",
            call_date__v: "2025-08-12",
            account__v: "V4T000000001000",
            clm__v: 1,
            ownerid__v: '20079861',
            detailed_products__v: 'EXPAREL',
            activity_type__c: 'product_call__c',
            parent_call__v: 'c4'
        }, {
            id: "c7",
            call_date__v: "2025-08-15",
            account__v: "V4T000000001001",
            clm__v: 0,
            ownerid__v: '20079859',
            detailed_products__v: 'ZILRETTA',
            activity_type__c: 'scientific_exchange__c',
            parent_call__v: 'c2'
        }],
        "success":true,
        "record_count":7
    },
    sent_email__v: {
        sent_email__v: [{
            id: "se1",
            subject__v: 'EXPAREL Discount Program',
            email_sent_date__v: "2025-10-02T20:27:19.000Z",
            account__v: "V4T000000001000",
            clicked__v: 0,
            ownerid__v: '20079859',
            last_click_date__v: '2025-10-02T11:34:39.000Z',
            product_display__v: 'EXPAREL'
        }, {
            id: "se2",
            subject__v: 'Medicare reimburses EXPAREL (J0666) in outpatient settings for spine procedures',
            email_sent_date__v: "2025-09-21T20:27:19.000Z",
            account__v: "V4T000000001000",
            clicked__v: 1,
            ownerid__v: '20079859',
            last_click_date__v: '2025-09-18T11:34:39.000Z',
            product_display__v: 'EXPAREL'
        }, {
            id: "se3",
            subject__v: 'EXCLUSIVE ORTHOFORUM CONTRACTED PRICING FOR ZILRETTA',
            email_sent_date__v: "2025-09-10T20:27:19.000Z",
            account__v: "V4T000000001000",
            clicked__v: 1,
            ownerid__v: '20079860',
            last_click_date__v: '2025-09-10T11:34:39.000Z',
            product_display__v: 'ZILRETTA'
        }, {
            id: "se4",
            subject__v: 'EXCLUSIVE ORTHOFORUM CONTRACTED PRICING FOR ZILRETTA',
            email_sent_date__v: "2025-08-10T20:27:19.000Z",
            account__v: "V4T000000001002",
            clicked__v: 1,
            ownerid__v: '20079860',
            last_click_date__v: '2025-09-10T11:34:39.000Z',
            product_display__v: 'ZILRETTA'
        }, {
            id: "se5",
            subject__v: 'SAFETY DATA FOR ZILRETTA',
            email_sent_date__v: "2025-08-04T20:27:19.000Z",
            account__v: "V4T000000001000",
            clicked__v: 0,
            ownerid__v: '20079859',
            last_click_date__v: '2025-09-10T11:34:39.000Z',
            product_display__v: 'ZILRETTA'
        }],
        "success":true,
        "record_count":3
    },
    event_attendee__v: {
        event_attendee__v: [{
            medical_event__v: "me1"
        }, {
            id: "pt2",
            medical_event__v: "me2"
        }],
        "success":true,
        "record_count":2
    },
    medical_event__v: {
        medical_event__v: [{
            id: "me1",
            name__v: '2024 Anesthesia Programming',
            ownerid__v: '20079859',
            event_type__v: 'congress_meeting__c',
            start_date__v: '2025-10-02'
        }, {
            id: "me2",
            name__v: '2024 EXPAREL Programming - General Surgery',
            ownerid__v: '20079860',
            event_type__v: 'speaker_program__c',
            start_date__v: '2025-09-09'
        }],
        "success":true,
        "record_count":2
    },
    suggestion__v: {
        suggestion__v: [{
            id: "sg1",
            title__v: 'Customer Ordering Pattern Alert',
            reason__v: 'Chilton Memorial Hospital appears to be meaningfully lagging behind its typical ordering pattern for Zilretta. Please consider calling on this customer as soon as possible. <br/>Most recent order was placed on: 2025-07-29 Alert Priority: High Most',
            record_type_name__v: 'call__v',
            priority__v: 'urgent__v',
            account__v: "V4T000000001001",
            posted_date__v: "2025-10-16",
            expiration_date__v: "2025-10-23",
            display_dismiss__v: 1,
            display_mark_as_complete__v: 1
        }, {
            id: "sg2",
            title__v: 'Follow up with speaker program attendee',
            reason__v: `Dr. John Smith attended 2025 EXPAREL Programming - Women's Health on Oct 6, 2025. Please follow up with a thank you email.`,
            record_type_name__v: 'email__v',
            priority__v: 'normal__v',
            account__v: "V4T000000001002",
            posted_date__v: "2025-10-10",
            expiration_date__v: "2025-10-17",
            display_dismiss__v: 1,
            display_mark_as_complete__v: 1
        }, {
            id: "sg4",
            title__v: 'Schedule Call for Digestive Care Center Admin Office',
            reason__v: 'Digestive Care Center Admin Office is a Portfolio Target with no calls for 30 days.',
            record_type_name__v: 'call__v',
            priority__v: 'normal__v',
            account__v: "V4T000000001002",
            posted_date__v: "2025-10-12",
            expiration_date__v: "2025-11-02",
            display_dismiss__v: 1,
            display_mark_as_complete__v: 1
        }, {
            id: "sg5",
            title__v: 'Disease management program',
            reason__v: `Dr. Duplessy enrolled a patient in a disease management program to participate in a relevant clinical study, based on patient's health data and current treatment.`,
            record_type_name__v: 'insight__v',
            priority__v: 'normal__v',
            account__v: "V4T000000001004",
            posted_date__v: "2025-10-02",
            expiration_date__v: "2025-11-02",
            display_dismiss__v: 1,
            display_mark_as_complete__v: 1
        }, {
            id: "sg3",
            title__v: 'Schedule Call for Dr Clinton Ackerman MD Practice',
            reason__v: 'Dr Clinton Ackerman MD Practice is a Portfolio Target with no calls for 30 days.',
            record_type_name__v: 'call__v',
            priority__v: 'normal__v',
            account__v: "V4T000000001003",
            posted_date__v: "2025-10-04",
            expiration_date__v: "2025-11-04",
            display_dismiss__v: 1,
            display_mark_as_complete__v: 1
        }],
        "success":true,
        "record_count":5
    },
    account_plan__v: {
        account_plan__v: [{
            id: "ap1",
            name__v: "Chilton Hospital - 2025 Plan"
        }],
        "success":true,
        "record_count":1
    },
    plan_tactic__v: {
        plan_tactic__v: [{
            id: "pt1",
            name__v: "Facility Level"
        }, {
            id: "pt2",
            name__v: "Orthopedic Forearm Wrist"
        }, {
            id: "pt3",
            name__v: "Orthopedic Hip"
        }, {
            id: "pt4",
            name__v: "Orthopedic Knee"
        }],
        "success":true,
        "record_count":4
    },
    account_tactic__v: {
        account_tactic__v: [{
            id: "at1",
            name__v: "Education & In-Service Training",
            pac_objective__c: "education_inservice_training__c",
            plan_tactic__v: "pt1",
            pac_objective_marked_for_delete__c: null,
            account_tactic_status__v: 'completed__v'
        }, {
            id: "at2",
            name__v: "IT / EMR Integration",
            pac_objective__c: "it_emr_integration__c",
            plan_tactic__v: "pt1",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'pending__v'
        }, {
            id: "at3",
            name__v: "Facility Administration",
            pac_objective__c: "facility_administration__c",
            plan_tactic__v: "pt1",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at4",
            name__v: "Ongoing Support & Metrics",
            pac_objective__c: "ongoing_support_metrics__c",
            plan_tactic__v: "pt1",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at5",
            name__v: "Surgeon Support",
            pac_objective__c: "surgeon_support",
            plan_tactic__v: "pt2",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at6",
            name__v: "Anesthesiology Buy-In",
            pac_objective__c: "anesthesiology_buyin__c",
            plan_tactic__v: "pt2",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at7",
            name__v: "Pharmacy Support",
            pac_objective__c: "pharmacy_support__c",
            plan_tactic__v: "pt2",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at8",
            name__v: "Perioperative Nursing Support",
            pac_objective__c: "perioperative_nursing_support__c",
            plan_tactic__v: "pt3",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }, {
            id: "at9",
            name__v: "Pharmacy Support",
            pac_objective__c: "pharmacy_support__c",
            plan_tactic__v: "pt3",
            pac_objective_marked_for_delete__c: 0,
            account_tactic_status__v: 'not_started__c'
        }],
        "success":true,
        "record_count":9
    },
    action_item__v: {
        action_item__v: [{
            id: "act1",
            name__v: "Agreement on patient selection criteria",
            pac_action_item__c: 'agreement_on_patient_selection_criteria__c',
            account_tactic__v: "at5",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-10",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act2",
            name__v: "Agreement on procedure selection criteria",
            pac_action_item__c: 'agreement_on_procedure_selection__c',
            account_tactic__v: "at5",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act3",
            name__v: "Lead surgeon(s) educated on EXPAREL MOA, outcomes, and appropriate use",
            pac_action_item__c: 'lead_surgeons_educated__c',
            account_tactic__v: "at5",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-20",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act4",
            name__v: "Agreement on timing and location of administration",
            pac_action_item__c: 'agreement_on_administration__c',
            account_tactic__v: "at6",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act5",
            name__v: "Alignment on nerve block vs infiltration strategy",
            pac_action_item__c: 'alignment_on_nerve_block_vs_infiltration__c',
            account_tactic__v: "at6",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-25",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act6",
            name__v: "Understanding of EXPAREL vs standard local anesthetic pharmacokinetics",
            pac_action_item__c: 'understanding_of_exparel_vs_standard__c',
            account_tactic__v: "at6",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-02",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act7",
            name__v: "Support for ERAS/multimodal protocols that include EXPAREL",
            pac_action_item__c: 'support_for_erasmultimodal_protocols__c',
            account_tactic__v: "at6",
            plan_tactic__v: "pt2",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-12",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act8",
            name__v: "Education on handling, timing, and documentation",
            pac_action_item__c: '',
            account_tactic__v: "at8",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-25",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act9",
            name__v: "Alignment with anesthesia and surgical teams",
            pac_action_item__c: '',
            account_tactic__v: "at8",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-30",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act10",
            name__v: "Documentation workflows aligned in EMR",
            pac_action_item__c: '',
            account_tactic__v: "at8",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act11",
            name__v: "Formulary committee (P&T) recommendation support",
            pac_action_item__c: '',
            account_tactic__v: "at7",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-25",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act12",
            name__v: "Clarity on storage, reconstitution, and handling procedures",
            pac_action_item__c: '',
            account_tactic__v: "at7",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-30",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act13",
            name__v: "Education on coding and billing implications",
            pac_action_item__c: 'education_on_coding_and_billing__c',
            account_tactic__v: "at7",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act14",
            name__v: "Formulary committee (P&T) recommendation support",
            pac_action_item__c: 'formulary_committee_pt_recommendation__c',
            account_tactic__v: "at9",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-25",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act15",
            name__v: "Clarity on storage, reconstitution, and handling procedures",
            pac_action_item__c: 'clarity_on_storage_reconstitution__c',
            account_tactic__v: "at9",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-30",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act16",
            name__v: "Education on coding and billing implications",
            pac_action_item__c: 'education_on_coding_and_billing__c',
            account_tactic__v: "at9",
            plan_tactic__v: "pt3",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act14",
            name__v: "Customization of order pathways for consistent use",
            pac_action_item__c: 'customization_of_order_pathways__c',
            account_tactic__v: "at2",
            plan_tactic__v: "pt1",
            action_item_status__v: "pending__v",
            due_date__v: "2025-11-25",
            completed_date__v: null,
            pac_progress__c: 'green__c',
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act15",
            name__v: "Outcome and documentation tracking enabled",
            pac_action_item__c: 'outcome_and_documentation_tracking__c',
            account_tactic__v: "at2",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-11-30",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act16",
            name__v: "Awareness of clinical/economic rationale",
            pac_action_item__c: 'awareness_of_clinicaleconomic_rationale__c',
            account_tactic__v: "at3",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act17",
            name__v: "Understanding of risk-benefit from patient satisfaction and throughput perspective",
            pac_action_item__c: 'understanding_of_riskbenefit__c',
            account_tactic__v: "at3",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act18",
            name__v: "Signed-off on budget impact or approved trial use",
            pac_action_item__c: 'signedoff_on_budget_impact_or_approved__c',
            account_tactic__v: "at3",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-05",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act19",
            name__v: "Support for cross-department collaboration",
            pac_action_item__c: 'support_for_crossdepartment__c',
            account_tactic__v: "at3",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2025-12-15",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act20",
            name__v: "In-service scheduled for OR staff, PACU, pharmacy, and nursing",
            pac_action_item__c: 'inservice_scheduled__c',
            account_tactic__v: "at1",
            plan_tactic__v: "pt1",
            action_item_status__v: "completed__v",
            due_date__v: "2025-12-15",
            completed_date__v: '2025-08-08',
            pac_progress__c: 'green__c',
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act21",
            name__v: "Documentation and dosing cards distributed",
            pac_action_item__c: 'documentation_and_dosing_cards__c',
            account_tactic__v: "at1",
            plan_tactic__v: "pt1",
            action_item_status__v: "completed__v",
            due_date__v: "2026-01-05",
            completed_date__v: '2025-09-21',
            pac_progress__c: 'yellow__c',
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act22",
            name__v: "Follow-up support structure in place (block workshops, Medforce, etc.)",
            pac_action_item__c: 'followup_support_structure__c',
            account_tactic__v: "at1",
            plan_tactic__v: "pt1",
            action_item_status__v: "completed__v",
            due_date__v: "2026-01-15",
            completed_date__v: '2025-10-02',
            pac_progress__c: 'yellow__c',
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act23",
            name__v: "In-service scheduled for OR staff, PACU, pharmacy, and nursing",
            pac_action_item__c: 'inservice_scheduled__c',
            account_tactic__v: "at1",
            plan_tactic__v: "pt1",
            action_item_status__v: "completed__v",
            due_date__v: "2026-01-31",
            completed_date__v: '2025-10-16',
            pac_progress__c: 'red__c',
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act24",
            name__v: "Tracking usage by surgeon and specialty",
            pac_action_item__c: 'tracking_usage_by_surgeon_and_specialty__c',
            account_tactic__v: "at4",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-01-30",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }, {
            id: "act25",
            name__v: "Monitoring patient outcomes (pain scores, opioid consumption, LOS)",
            pac_action_item__c: 'monitoring_patient_outcomes__c',
            account_tactic__v: "at4",
            plan_tactic__v: "pt1",
            action_item_status__v: "not_started__c",
            due_date__v: "2026-02-12",
            completed_date__v: null,
            pac_progress__c: null,
            pac_action_item_marked_for_delete__c: null
        }],
        "success":true,
        "record_count":25
    },
    key_stakeholder__v: {
        key_stakeholder__v: [{
            id: "k1",
            key_stakeholder__v: "V4T000000001001",
            role__v: "education_nurse__c",
            pac_key_stakeholder_marked_for_delete__c: 0
        }, {
            id: "k2",
            key_stakeholder__v: "V4T000000001002",
            role__v: "clinical_pharmacist__c",
            pac_key_stakeholder_marked_for_delete__c: 0
        }, {
            id: "k3",
            key_stakeholder__v: "V4T000000001003",
            role__v: "administrator__c",
            pac_key_stakeholder_marked_for_delete__c: 0
        }, {
            id: "k4",
            key_stakeholder__v: "V4T000000001004",
            role__v: "administrator__c",
            pac_key_stakeholder_marked_for_delete__c: 1
        }],
        "success":true,
        "record_count":4
    },
    child_account__v: {
        child_account__v: [
            {
                child_account__v: "V4T000000001001",
                child_name__v: "Christopher Wu"
            },
            {
                child_account__v: "V4T000000001002",
                child_name__v: "John Smith"
            },
            {
                child_account__v: "V4T000000001003",
                child_name__v: "Clinton Ackerman"
            },
            {
                child_account__v: "V4T000000001004",
                child_name__v: "Arielle Duplessy"
            }
        ],
        object: {
          plural: "Child Accounts",
          singular: "Child Account",
          name: "child_account__v",
        },
        name: "child_account__v",
        fieldLabels: [
          { name: "id", display: "ID" },
          { name: "child_account__v", display: "Child Account" },
          { name: "parent_account__v", display: "Parent Account" },
          { name: "child_record_type__v", display: "Child Record Type" },
        ]
    },
    message__v: {
        message__v: [
            {
                name__v: "AM_NO_RECORDS",
                text__v: "No records to display",
            },
            {
                name__v: "AM_PROFILE_DETAILS",
                text__v: "Profile Details",
            },
            {
                name__v: "AM_PRIMARY_PARENT",
                text__v: "Primary Parent",
            },
            {
                name__v: "AM_HCO_TYPE",
                text__v: "HCO Type",
            },
            {
                name__v: "AM_WEBSITE",
                text__v: "Website",
            },
            {
                name__v: "AM_IDN",
                text__v: "IDN",
            },
            {
                name__v: "AM_PRIMARY_GPO",
                text__v: "Primary GPO",
            },
            {
                name__v: "AM_PRIMARY_ADDRESS",
                text__v: "Primary Address",
            },
            {
                name__v: "AM_PHONE",
                text__v: "Phone",
            },
            {
                name__v: "AM_PRODUCTS",
                text__v: "Products",
            },
            {
                name__v: "AM_PRIORITY",
                text__v: "Priority",
            },
            {
                name__v: "AM_POWER_BI",
                text__v: "Power BI",
            },
            {
                name__v: "AM_TOTAL_CALLS",
                text__v: "Total Calls",
            },
            {
                name__v: "AM_LAST_CALL",
                text__v: "Last Call",
            },
            {
                name__v: "AM_CALLS_W_CLM",
                text__v: "Calls w/ Media",
            },
            {
                name__v: "AM_TOTAL_ATTENDEES",
                text__v: "Total Attendees",
            },
            {
                name__v: "AM_TOTAL_SENT_EMAILS",
                text__v: "Total Sent Emails",
            },
            {
                name__v: "AM_LAST_SENT",
                text__v: "Last Sent",
            },
            {
                name__v: "AM_EMAIL_CLICKED_RATE",
                text__v: "% Email Clicked",
            },
            {
                name__v: "AM_LAST_CLICKED",
                text__v: "Last Clicked",
            },
            {
                name__v: "AM_PENDING_SUGGESTIONS",
                text__v: "Pending Suggestions",
            },
            {
                name__v: "AM_MOST_RECENT",
                text__v: "Most Recent",
            },
            {
                name__v: "AM_ACTIVITY_TIMELINE",
                text__v: "Activity Timeline",
            },
            {
                name__v: "AM_OWNER",
                text__v: "Owner",
            },
            {
                name__v: "AM_MY",
                text__v: "My",
            },
            {
                name__v: "AM_ALL",
                text__v: "All",
            },
            {
                name__v: "AM_POSTED",
                text__v: "Posted",
            },
            {
                name__v: "AM_HCP",
                text__v: "HCP",
            },
            {
                name__v: "AM_SUGGESTION_TYPE_ALL",
                text__v: "Type (All)",
            },
            {
                name__v: "AM_SUGGESTION_TYPE_CALL",
                text__v: "Call",
            },
            {
                name__v: "AM_SUGGESTION_TYPE_EMAIL",
                text__v: "Email",
            },
            {
                name__v: "AM_SUGGESTION_TYPE_INSIGHT",
                text__v: "Insight",
            },
            {
                name__v: "AM_NEW",
                text__v: "New",
            },
            {
                name__v: "AM_EXPIRING_SOON",
                text__v: "Expiring soon",
            },
            {
                name__v: "AM_SUGGESTION_DETAIL",
                text__v: "Suggestion Detail",
            },
            {
                name__v: "AM_BUTTON_DISMISS",
                text__v: "Dismiss",
            },
            {
                name__v: "AM_BUTTON_MARK_AS_COMPLETE",
                text__v: "Mark as Complete",
            },
            {
                name__v: "AM_BUTTON_SCHEDULE_CALL",
                text__v: "Schedule Call",
            },
            {
                name__v: "AM_BUTTON_SEND_EMAIL",
                text__v: "Send Email",
            },
            {
                name__v: "AM_BUTTON_CLOSE",
                text__v: "Close",
            },
            {
                name__v: "AM_TITLE",
                text__v: "Title",
            },
            {
                name__v: "AM_REASON",
                text__v: "Reason",
            },
            {
                name__v: "AM_POSTED_DATE",
                text__v: "Posted Date",
            },
            {
                name__v: "AM_EXPIRATION_DATE",
                text__v: "Expires",
            },
            {
                name__v: "AM_ENGAGEMENT_PLAN",
                text__v: "Engagement Plan",
            },
            {
                name__v: "AM_KEY_STAKEHOLDERS",
                text__v: "Key Stakeholders",
            },
            {
                name__v: "AM_COL_ACTION_ITEM",
                text__v: "Action Item",
            },
            {
                name__v: "AM_COL_STATUS",
                text__v: "Status",
            },
            {
                name__v: "AM_COL_DUE_DATE",
                text__v: "Due Date",
            },
            {
                name__v: "AM_COL_COMPLETED_DATE",
                text__v: "Completed Date",
            },
            {
                name__v: "AM_COL_ACTIONS",
                text__v: "Actions",
            },
            {
                name__v: "AM_NEW_ACTION_ITEM",
                text__v: "New Action Item",
            },
            {
                name__v: "AM_EDIT_ACTION_ITEM",
                text__v: "Edit Action Item",
            },
            {
                name__v: "AM_DELETE_ACTION_ITEM",
                text__v: "Delete Action Item",
            },
            {
                name__v: "AM_NEW_ACCOUNT_TACTIC",
                text__v: "New Objective",
            },
            {
                name__v: "AM_EDIT_ACCOUNT_TACTIC",
                text__v: "Edit Objective",
            },
            {
                name__v: "AM_DELETE_ACCOUNT_TACTIC",
                text__v: "Delete Objective",
            },
            {
                name__v: "AM_NEW_KEY_STAKEHOLDER",
                text__v: "New Key Stakeholder",
            },
            {
                name__v: "AM_EDIT_KEY_STAKEHOLDER",
                text__v: "Edit Key Stakeholder",
            },
            {
                name__v: "AM_DELETE_KEY_STAKEHOLDER",
                text__v: "Delete Key Stakeholder",
            },
            {
                name__v: "AM_BUTTON_CANCEL",
                text__v: "Cancel",
            },
            {
                name__v: "AM_BUTTON_SAVE",
                text__v: "Save",
            },
            {
                name__v: "AM_SERVICE_LINE",
                text__v: "Service Line",
            },
            {
                name__v: "AM_OBJECTIVE",
                text__v: "Objective",
            },
            {
                name__v: "AM_DELETE_PROMPT",
                text__v: "Are you sure you want to permanently delete this record and all associated data?",
            },
            {
                name__v: "AM_IN_PROGRESS",
                text__v: "In Progress"
            },
            {
                name__v: "AM_COL_NAME",
                text__v: "Name"
            },
            {
                name__v: "AM_COL_ROLE",
                text__v: "Role"
            },
            {
                name__v: "AM_COL_SPECIALTY",
                text__v: "Specialty"
            },
            {
                name__v: "AM_COL_EXPAREL_PRIORITY",
                text__v: "Exparel Priority",
            },
            {
                name__v: "AM_COL_ZILRETTA_PRIORITY",
                text__v: "Zilretta Priority",
            },
            {
                name__v: "AM_COL_IOVERA_PRIORITY",
                text__v: "Iovera Priority",
            }, 
            {
                name__v: "AM_COL_CITY",
                text__v: "City",
            },
            {
                name__v: "AM_COL_STATE",
                text__v: "State",
            },
            {
                name__v: "AM_COL_LAST_CALL_DATE",
                text__v: "Last Call Date",
            },
            {
                name__v: "AM_COL_LAST_EMAIL_DATE",
                text__v: "Last Email Date",
            },
            {
                name__v: "AM_CHILD_ACCOUNT",
                text__v: "Child Account",
            },
            {
                name__v: "AM_BUTTON_OK",
                text__v: "OK",
            },
            {
                name__v: "AM_CREATE_SUCCESS_MSG",
                text__v: "Record(s) are successfully added!",
            },
            {
                name__v: "AM_UPDATE_SUCCESS_MSG",
                text__v: "Record(s) are successfully updated!",
            },
            {
                name__v: "AM_FIELD_REQUIRED",
                text__v: "This field is required",
            },
            {
                name__v: "AM_POWER_BI_URL",
                text__v: "https://app.powerbi.com/home?experience=power-bi",
            },
            {
                name__v: "AM_DEFAULT_TAB",
                text__v: "keyStakeholder"
            },
            {
                name__v: "AM_COL_PROGRESS",
                text__v: "Progress"
            },
            {
                name__v: "ZILRETTA_MAX_CALL",
                text__v: "2"
            },
            {
                name__v: "ZILRETTA_MED_CALL",
                text__v: "1"
            },
            {
                name__v: "AM_TEAM_IDENTIFIER",
                text__v: "i:Iovera;;Z:Zilretta;;S:Exparel;;D:OMFS"
            },
            {
                name__v: "NEW_OBJECTIVE",
                text__v: "New Objective"
            },
            {
                name__v: "AM_BUTTON_EDIT",
                text__v: "Edit"
            },
            {
                name__v: "AM_BUTTON_DELETE",
                text__v: "Delete"
            },
            {
                name__v: "AM_NEW_OBJECTIVE",
                text__v: "New Objective",
            },
            {
                name__v: "AM_OBJECTIVES",
                text__v: "Objectives",
            },
            {
                name__v: "AM_ZILRETTA_PRIORITY",
                text__v: "Zilretta Priority",
            },
            {
                name__v: "AM_PRODUCT_PROMO_RESTRICTIONS",
                text__v: "Product Promo Restrictions",
            },
            {
                name__v: "AM_SAMPLING_RESTRICTIONS",
                text__v: "Sampling Restrictions",
            },
            {
                name__v: "AM_EXPAREL_PRIORITY",
                text__v: "Exparel Priority",
            },
            {
                name__v: "AM_IOVERA_PRIORITY",
                text__v: "Iovera Priority",
            },
            {
                name__v: "AM_SALES_CONTRACTED",
                text__v: "Contracted",
            },
            {
                name__v: "AM_SALES_DIRECT",
                text__v: "Direct",
            },
            {
                name__v: "AM_SALES_MIXED",
                text__v: "Mixed"
            },
            {
                name: "AM_ZILRETTA_OBJECTIVES",
                text__v: "key_stakeholder_identification__c;collaboration_partner_alignment__c;material_distribution__c;ongoing_support_resources_enrollment__c",
            },
            {
                name: "AM_EXPAREL_OBJECTIVES",
                text__v: "facility_administration__c;it_emr_integration__c;ongoing_support_metrics__c;pt_committee_approval__c;perioperative_nursing_support__c;pharmacy_support__c;revenue_cycle_billing__c;education_inservice_training__c;surgeon_support__c;anesthesiology_buyin__c",
            },
            {
                name: "AM_OMFS_OBJECTIVES",
                text__v: "identifying_targets_key_stakeholders__c;scheduling_educational_opportunities__c;quarterly_planning__c;ongoing_relationship_management__c",
            },
            {
                name: "AM_IOVERA_OBJECTIVES",
                text__v: "",
            },
            {
                name: "AM_ZILRETTA_ACTION_ITEMS",
                text__v: "physicians_advanced_practitioners__c;office_managers__c;billing_managers__c;office_staff__c;align_on_jjmt_and_pacira_shared_accounts__c;connect_with_frms_monthly__c;coordinate_with_fff_representatives__c;participate_in_localregional_meetings_q__c;coordinate_with_jnj_counterparts_2x_per__c;distribute_the_revenue_cycle_report__c;disseminate_the_payer_grid_to_key_stakeh__c;brand_the_office_appropriately_with_mult__c;discuss_lunch_and_learn_programs__c;gain_customer_commitment__c;introduce_or_reinforce_flexforward__c;provide_copay_and_specialty_pharmacy_ass__c;discuss_speaker_bureau_opportunities__c;host_event_programs_minimum_2_per_year__c;partner_with_jjmt_on_1_joint_event__c;monitor_inventory_levels_if_applicable__c;connect_frm_with_copay_accounts_that_are__c"
            },
            {
                name: "AM_EXPAREL_ACTION_ITEMS",
                text__v: "clinical_pharmacist_review_and_approval__c;clarity_on_storage_reconstitution__c;education_on_coding_and_billing__c;formulary_committee_pt_recommendation__c;clinical_dossier_submitted_and_reviewed__c;budget_impact_and_outcomes_data_provided__c;support_from_surgeon_and_pharmacy__c;approval_granted__c;education_on_handling_timing_ect__c;alignment_with_anesthesia_and_surgical__c;documentation_workflows_aligned__c;exparel_mapped_to_appropriate_charge__c;coding_and_reimbursement_pathway__c;field_reimbursement_manager_review__c;finance_aware_of_acquisition_cost__c;awareness_of_clinicaleconomic_rationale__c;understanding_of_riskbenefit__c;signedoff_on_budget_impact_or_approved__c;support_for_crossdepartment__c;exparel_added_to_order_sets__c;customization_of_order_pathways__c;outcome_and_documentation_tracking__c;tracking_usage_by_surgeon_and_specialty__c;monitoring_patient_outcomes__c;identifying_compliance_gaps__c;regular_business_reviews__c;inservice_scheduled__c;documentation_and_dosing_cards__c;followup_support_structure__c;lead_surgeons_educated__c;agreement_on_patient_selection_criteria__c;agreement_on_procedure_selection__c;incorporation_into_protocols__c;commitment_to_procedural_consistency__c;alignment_on_nerve_block_vs_infiltration__c;agreement_on_administration__c;understanding_of_exparel_vs_standard__c;support_for_erasmultimodal_protocols__c"
            },
            {
                name: "AM_OMFS_ACTION_ITEMS",
                text__v: "use_surgeon_selector_to_identify_key_tar__c;identify_the_team_members_who_do_referra__c;identify_other_key_team_members_such_as__c;leverage_onepacira_contacts_such_as_the__c;partner_with_local_andor_regional_plast__c;use_veeva_events_to_schedule_speaker_pro__c;target_anesthesia_travel_groups__c;schedule_unique_lunches__c;complete_quarterly_business_review__c;complete_clinical_review__c;leverage_remedy_for_administrative_suppo__c;leverage_the_marketing_toolkit_for_websi__c;distribute_brochures__c;confirm_insurance_dcodejcode__c;complete_clinical_messaging_regarding_op__c;complete_referrals_through_asking_succes__c;send_relevant_rtes__c;complete_the_exparel_empty_vials_in_a_va__c"
            },
            {
                name: "AM_IOVERA_ACTION_ITEMS",
                text__v: ""
            },
            {
                name__v: 'AM_COL_EMAIL',
                text__v: 'Has Email?'
            },
            {
                name__v: 'AM_DO_NOT_CALL',
                text__v: 'HCO Restricted Visibility'
            }
        ],
        success: true,
        record_count: 10,
    }
};

export const getPicklistValueLabels = {
    "account__v": {
        "pac_exparel_priority__c": [
            {
                "name": "high__c",
                "label": "high",
                "isActive": true
            },
            {
                "name": "medium__c",
                "label": "medium",
                "isActive": true
            },
            {
                "name": "low__c",
                "label": "low",
                "isActive": true
            }
        ],
        "business_title__c": [
            {
                "name": "administrator__c",
                "label": "Administrator",
                "isActive": true
            },
            {
                "name": "billing_manager__c",
                "label": "Billing & Coding Manager/Supervisor",
                "isActive": true
            },
            {
                "name": "clinical_pharmacist__c",
                "label": "Clinical Pharmacist",
                "isActive": true
            },
            {
                "name": "education_nurse__c",
                "label": "Education Nurse",
                "isActive": true
            },
            {
                "name": "manager__c",
                "label": "Manager",
                "isActive": true
            }
        ],
        "specialty_1__v": [
            {
                "name": "cd__v",
                "label": "Cardiology",
                "isActive": true
            },
            {
                "name": "dt__v",
                "label": "Dentistry",
                "isActive": true
            },
            {
                "name": "dm__v",
                "label": "Dermatology",
                "isActive": true
            },
            {
                "name": "hm__v",
                "label": "Hematology",
                "isActive": true
            },
            {
                "name": "imic__v",
                "label": "Intensive Care Medicine",
                "isActive": true
            }
        ],
        "hco_type_cda__v": [
            {
                "name": "ho__v",
                "label": "Hospital",
                "isActive": true
            },
            {
                "name": "hlsy__v",
                "label": "Health System",
                "isActive": true
            },
            {
                "name": "imag__v",
                "label": "Imaging Center",
                "isActive": true
            }
        ]
    },
    "call2__v": {
        "activity_type__c": [
            {
                "name": "sales_rep_support__c",
                "label": "Sales Rep Support",
                "isActive": true
            },
            {
                "name": "scientific_exchange__c",
                "label": "Scientific Exchange",
                "isActive": true
            },
            {
                "name": "product_call__c",
                "label": "Product Call",
                "isActive": true
            },
            {
                "name": "general_meeting__c",
                "label": "General Meeting",
                "isActive": true
            },
            {
                "name": "face_to_face__c",
                "label": "Face to Face",
                "isActive": true
            },
            {
                "name": "phone__c",
                "label": "Phone",
                "isActive": true
            }
        ]
    },
    "user__sys": {
        "user_type__v": [
            {
                "name": "sales__v",
                "label": "Sales",
                "isActive": true
            },
            {
                "name": "medical__v",
                "label": "Medical",
                "isActive": true
            },
            {
                "name": "marketing__v",
                "label": "Marketing",
                "isActive": true
            }
        ]
    },
    "account_tactic__v": {
        "account_tactic_status__v": [
            {
                "name": "not_started__c",
                "label": "Not Started",
                "isActive": true
            },
            {
                "name": "pending__v",
                "label": "Pending",
                "isActive": true
            },
            {
                "name": "completed__v",
                "label": "Completed",
                "isActive": true
            }
        ],
        "pac_objective__c": [
            {
                "name": "anesthesiology_buyin__c",
                "label": "Anesthesiology Buy-In",
                "isActive": true
            },
            {
                "name": "education_inservice_training__c",
                "label": "Education & In-Service Training",
                "isActive": true
            },
            {
                "name": "facility_administration__c",
                "label": "Facility Administration",
                "isActive": true
            },
            {
                "name": "it_emr_integration__c",
                "label": "IT / EMR Integration",
                "isActive": true
            },
            {
                "name": "ongoing_support_metrics__c",
                "label": "Ongoing Support & Metrics",
                "isActive": true
            },
            {
                "name": "pharmacy_support__c",
                "label": "Pharmacy Support",
                "isActive": true
            },
            {
                "name": "perioperative_nursing_support__c",
                "label": "Perioperative Nursing Support",
                "isActive": true
            },
            {
                "name": "surgeon_support",
                "label": "Surgeon Support",
                "isActive": true
            },

        ]
    },
    "action_item__v": {
        "pac_action_item__c": [
            {
                "name": "agreement_on_patient_selection_criteria__c",
                "label": "Agreement on patient selection criteria",
                "isActive": true
            },
            {
                "name": "agreement_on_procedure_selection__c",
                "label": "Agreement on procedure selection criteria",
                "isActive": true
            },
            {
                "name": "lead_surgeons_educated__c",
                "label": "Lead surgeon(s) educated on EXPAREL MOA, outcomes, and appropriate use",
                "isActive": true
            },
            {
                "name": "lead_surgeons_educated__c",
                "label": "Monitoring patient outcomes (pain scores, opioid consumption, LOS)",
                "isActive": true
            },
            {
                "name": "monitoring_patient_outcomes__c",
                "label": "Monitoring patient outcomes (pain scores, opioid consumption, LOS)",
                "isActive": true
            },
            {
                "name": "tracking_usage_by_surgeon_and_specialty__c",
                "label": "Tracking usage by surgeon and specialty",
                "isActive": true
            },
            {
                "name": "inservice_scheduled__c",
                "label": "In-service scheduled for OR staff, PACU, pharmacy, and nursing",
                "isActive": true
            },
            {
                "name": "followup_support_structure__c",
                "label": "Follow-up support structure in place (block workshops, Medforce, etc.)",
                "isActive": true
            },
            {
                "name": "documentation_and_dosing_cards__c",
                "label": "Documentation and dosing cards distributed",
                "isActive": true
            },
            {
                "name": "inservice_scheduled__c",
                "label": "In-service scheduled for OR staff, PACU, pharmacy, and nursing",
                "isActive": true
            },
            {
                "name": "support_for_crossdepartment__c",
                "label": "Support for cross-department collaboration",
                "isActive": true
            },
            {
                "name": "signedoff_on_budget_impact_or_approved__c",
                "label": "Signed-off on budget impact or approved trial use",
                "isActive": true
            },
            {
                "name": "understanding_of_riskbenefit__c",
                "label": "Understanding of risk-benefit from patient satisfaction and throughput perspective",
                "isActive": true
            },
            {
                "name": "awareness_of_clinicaleconomic_rationale__c",
                "label": "Awareness of clinical/economic rationale",
                "isActive": true
            },
            {
                "name": "outcome_and_documentation_tracking__c",
                "label": "Outcome and documentation tracking enabled",
                "isActive": true
            },
            {
                "name": "customization_of_order_pathways__c",
                "label": "Customization of order pathways for consistent use",
                "isActive": true
            },
            {
                "name": "education_on_coding_and_billing__c",
                "label": "Education on coding and billing implications",
                "isActive": true
            },
            {
                "name": "clarity_on_storage_reconstitution__c",
                "label": "Clarity on storage, reconstitution, and handling procedures",
                "isActive": true
            },
            {
                "name": "formulary_committee_pt_recommendation__c",
                "label": "Formulary committee (P&T) recommendation support",
                "isActive": true
            },
            {
                "name": "education_on_coding_and_billing__c",
                "label": "Education on coding and billing implications",
                "isActive": true
            },
            {
                "name": "agreement_on_administration__c",
                "label": "Agreement on timing and location of administration",
                "isActive": true
            },
            {
                "name": "alignment_on_nerve_block_vs_infiltration__c",
                "label": "Alignment on nerve block vs infiltration strategy",
                "isActive": true
            },
            {
                "name": "understanding_of_exparel_vs_standard__c",
                "label": "Understanding of EXPAREL vs standard local anesthetic pharmacokinetics",
                "isActive": true
            },
            {
                "name": "support_for_erasmultimodal_protocols__c",
                "label": "Support for ERAS/multimodal protocols that include EXPAREL",
                "isActive": true
            }
        ],
        "pac_progress__c": [
            {
                "name": "green__c",
                "label": "Green",
                "isActive": true
            },
            {
                "name": "yellow__c",
                "label": "Yellow",
                "isActive": true
            },
            {
                "name": "red__c",
                "label": "Red",
                "isActive": true
            }
        ]
    },
    "key_stakeholder__v": {
        "role__v": [
            {
                "name": "administrator__c",
                "label": "Administrator",
                "isActive": true
            },
            {
                "name": "clinical_pharmacist__c",
                "label": "Clinical Pharmacist",
                "isActive": true
            },
            {
                "name": "education_nurse__c",
                "label": "Education Nurse",
                "isActive": true
            }
        ]
    },
    "medical_event__v": {
        "event_type__v": [
            {
                "name": "congress_meeting__c",
                "label": "Congress Meeting",
                "isActive": true
            },
            {
                "name": "speaker_program__c",
                "label": "Speaker Program",
                "isActive": true
            }
        ]
    }
};