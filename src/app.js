import axios from "axios";
import Icon from './components/icon/icon.vue'
import modal from './components/modal/modal.vue'

export default {
    name: 'app',

    components: {
        icon: Icon,
        modal
    },

    data() {
        return {
            apiUrl: 'https://apiservices.pstuffapp.com/api/graphql',
            policytypes: [],
            policyformats: [],
            companies: [],
            services: [],
            policynumber: null,
            formSubmitted: false,
            requestDone: false,
            currentcompany: null,
            currenttype: null,
            currentphone: null,
            currentdate: null,
            modal: false
        }
    },

    mounted() {
        this.getInitialData();
    },

    computed: {
        currentnumber() {
            return this.policynumber.replace(/[ ,-]/g, '');
        },
        currentformat() {
            return this.policynumber.replace(/[0-9]/g, "9");
        },
        chosenServices() {
            return this.services.filter(service => service.active)
        },
        notChosenServices() {
            return this.services.filter(service => !service.active)
        },
        submitBtnClass() {
            if(this.requestDone) {
                return 'btn--secondary'
            } else if(this.formErrors.valid) {
                return 'btn--primary'
            }
        },
        formErrors() {
            let errors = {
                policy: !this.policynumber,
                company: !this.currentcompany,
                services: !this.chosenServices.length > 0,
            };
            errors.valid = !(errors.policy | errors.company || errors.services);
            return errors
        },
    },

    methods: {
        getInitialData() {
            axios({
                method: "POST",
                url: this.apiUrl,
                data: {
                    query: `
                    {
                        policytypes {
                            id
                            name
                        }
                        companies {
                            id
                            phone
                            name
                            logo
                        }
                        services {
                           id
                           name
                        }
                        policyformats {
                            format
                            type {
                                id
                                name
                            }
                            company {
                                id
                                name
                                logo
                                phone
                            }
                        }
                    }
                `
                }
            }).then(response => {
                this.policytypes = response.data.data.policytypes;
                this.policyformats = response.data.data.policyformats;
                this.currenttype = this.policytypes[0];
                this.companies = response.data.data.companies;
                this.services = response.data.data.services.map(el => {
                    el.active = false;
                    el.status = null;
                    return el
                })
            })
        },
        updateServices(chosenService) {
            let service = this.services.find(el => el.id === chosenService.id);
            if(service) service.active = true;
        },
        updateType(type) {
            this.currenttype = type
        },
        updatePolicy($event) {
            this.policynumber = $event.target.value.replace(/[^0-9, ' ', -]/g, '');
            const format = this.policyformats.find(el => el.format === this.currentformat);
            if(format) {
                this.currentcompany = format.company;
                this.currenttype = format.type;
        }},
        updateSelected(service) {
            this.services.find(el => el.id === service.id).active = false;
        },
        clearData() {
            this.services = this.services.map(service => {
                service.active = false;
                return service
            });
            this.policynumber = null;
            this.requestDone = false;
            this.formSubmitted = false;
            this.currentcompany = null;
            this.currentphone = null;
            this.currentdate = null;
        },
        formatPhone(val) {
            return val.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");
        },
        timestampToDate(timestamp) {
            let newDate = new Date();
            newDate.setTime(timestamp);
            let year = newDate.getFullYear();
            let month = newDate.getMonth()+1;
            let day = newDate.getDate();
            if(month < 10) month = '0' + month;
            return `${day}.${month}.${year}`
        },
        submitForm(e) {
            e.preventDefault();
            this.formSubmitted = true;
            if(this.requestDone) {
                this.clearData();
            } else {
                if(this.formErrors.valid) {
                    axios({
                        method: "POST",
                        url: this.apiUrl,
                        data: {
                            query: `
                                {
                                    policy(number: "${this.currentnumber}", 
                                           format: "${this.currentformat}") {
                                        number
                                        date_end
                                        type {
                                            id  
                                            name
                                        }
                                        company {
                                            id
                                            name
                                            logo
                                        }
                                        services {
                                            id  
                                            name
                                        }
                                    }
                                }
                            `
                        }
                    })
                    .then(response => {
                        this.requestDone = true;
                        const data = response.data.data.policy;
                        if (data) {
                            this.currentphone = this.formatPhone(this.currentcompany.phone);
                            this.currentdate = this.timestampToDate(data.date_end);
                            this.currenttype = data.type;
                            this.currentcompany = data.company;
                            this.services.map(service => {
                                if (data.services.find(s => s.id === service.id)) {
                                    service.status = "included";
                                } else {
                                    service.status = "excluded";
                                }
                                return service
                            })
                        } else {
                            this.requestDone = false;
                            this.modal = true;
                        }
                    })
                    .catch(error => {
                        alert(error)
                    })
                }
            }
        }
    },
}
