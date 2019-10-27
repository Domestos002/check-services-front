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
            apiUrl: 'http://localhost:85/api/graphql',
            policytypes: [],
            policyformats: [],
            companies: [],
            services: [],
            policynumber: null,
            formSubmitted: false,
            currentcompany: null,
            currenttype: null,
            modal: false
        }
    },

    mounted() {
        this.getInitialData();
    },

    computed: {
        currentnumber() {
            return this.policynumber.replace(/[' ', -]/g, '');
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
        policynumberError() {
            return !this.policynumber;
        }
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
                    el.active = true;
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
            this.formSubmitted = false;
            this.policynumber = $event.target.value.replace(/[^0-9, ' ', -]/g, '');
            const format = this.policyformats.find(el => el.format === this.currentformat);
            if(format) {
                this.currentcompany = format.company;
                this.currenttype = format.type;
        }},
        updateSelected(service) {
            this.services.find(el => el.id === service.id).active = false;
        },
        submitForm(e) {
            e.preventDefault();
            this.formSubmitted = true;
            if(!this.policynumberError) {
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
                    const data = response.data.data.policy;
                    console.log(data)
                    if (data) {
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
                        this.modal = true;
                    }
                })
                .catch(error => {
                    alert(error)
                })
            }
        }
    },
}
