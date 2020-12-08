

var claim_msg_type;
var companyName;
var transactionNumber;
var claim_type;
var subType;
var disbursementType;
var beneficiaryType;
var claimStatus;
var docsPending;
var docsReceived;
var policyNumber;
var claimantFirstName;
// var denialTag;
var claimAmount;
var currency;
var requirementsList = [];
var sourceSystem;
var isFallout;
var surveyTag;
var referenceNumber = null;

var surveyQues1;
var surveyAns1 = 0;
var surveyQues2;
var surveyAns2 = 0;
var surveyQues3;
var surveyAns3 = 0;
var surveyObj = {};

var survey_form = document.getElementById('customer_survey');

survey_form.addEventListener('submit', submit_survey);

function getAccidentPage() {
    console.log('get accident page ');
    window.parent.postMessage(JSON.stringify({
        event_code: 'ym-client-event', data: JSON.stringify({
            event: {
                code: "nextaction",
                data: "accident"
            }
        })
    }), '*');
}

function getIllnessPage() {
    console.log('get illness page ');
    window.parent.postMessage(JSON.stringify({
        event_code: 'ym-client-event', data: JSON.stringify({
            event: {
                code: "nextaction",
                data: "illness"
            }
        })
    }), '*');
}

function getDeathPage() {
    console.log('get death page ');
    window.parent.postMessage(JSON.stringify({
        event_code: 'ym-client-event', data: JSON.stringify({
            event: {
                code: "nextaction",
                data: "death"
            }
        })
    }), '*');
}

function captcha() {

    // $('#refNoWarning').modal('hide');
    if (grecaptcha && grecaptcha.getResponse().length > 0) {

        referenceNumber = document.getElementById('reference_number').value
        if (referenceNumber != null) { trackProgress(); }
    } else {
        $("#err_recaptcha").text('Please verify the reCAPTCHA and tick the check box before submission');
        $("#err_recaptcha").show();
        // activeProcess()
    }


    /*before api intgrtn*/
    // // $('#refNoWarning').modal('hide');
    // if (grecaptcha && grecaptcha.getResponse().length > 0) {

    //     referenceNumber = document.getElementById('reference_number').value
    //     trackProgress();
    // } else {
    //     $("#err_recaptcha").text('Please verify the reCAPTCHA and tick the check box before submission');
    //     $("#err_recaptcha").show();
    //     // activeProcess()
    // }
}

function trackUser() {

    $('.dropdown-content').toggle()
    $('.arrow-up').toggle();
    $('.arrow-down ').toggle();



}



// function dummyRefNumberTest() {

//     if ($('#reference_number').val() == '1234') {
//         claim_type = 'accident';
//         claim_msg_type = 'A-1'
//         return true;
//     }
//     else if ($('#reference_number').val() == '5678') {
//         claim_type = 'illness';
//         claim_msg_type = 'I-2'
//         return true;
//     }
//     else if ($('#reference_number').val() == '9012') {
//         claim_type = 'death';
//         claim_msg_type = 'D-2'
//         return true;
//     }
//     else {
//         return false;

//     }
// }

function trackProgress() {
    // api call on clicking GO button from claim status screen
    var res;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    var raw = JSON.stringify({ "companyName": "PAL", "TIPSReferenceNumber": referenceNumber });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };
    fetch("http://localhost:3000/claim_status", requestOptions).then((response) => response.json())
        .then(response => {
            if (response.returnCode != '0') {
                $('#refNoWarning').modal('show');
            }
            else {
                if (response.type.toLowerCase() == 'death') {
                    claim_type = response.type
                }
                else {
                    claim_type = response.subType
                }
                transactionNumber = response.transactionNumber;
                disbursementType = response.disbursementType;
                beneficiaryType = response.beneficiaryType;
                claimStatus = response.claimStatus;
                docsPending = response.docsPending;
                docsReceived = response.docsReceived;
                policyNumber = response.policyNumber;
                claimantFirstName = response.claimantFirstName;
                // denialTag = response.denialTag;
                sourceSystem = response.sourceSystem;
                isFallout = response.isFallout;
                claimAmount = response.claimAmount;
                currency = response.currency;
                requirementsList = response.requirementsList;
                surveyTag = response.surveyTag;

                //for customer survey
                if (claimStatus.toLowerCase() == 'denied' || claimStatus.toLowerCase() == 'approved' && surveyTag == 'N') {
                    $('#customer_survey').show()
                }
                else {

                    $('#customer_survey').hide()
                }
                //for customer survey


                document.getElementById('payment_amount').innerHTML = currency + ' ' + claimAmount;

                displayDateForClaimStatus()
                $("#img_claim").hide();
                $("#claim").hide();
                $("#reference_No").hide();

                // document.getElementById('text').innerHTML = document.getElementById('payout-pickup-ill').innerHTML;
                // activeProcess()
                // activeProcessCircle()
                $("#err_recaptcha").text('');
                $("#err_recaptcha").hide();
                $("#reference-divider").show();
                $("#process_confirmation1").show();
                setClaimProgressScreen(); // to set header title and image for claim status screen
                trackProgressDropDown(trackMessagesArr) // for tracking progress dropdown
            }
        }).catch(error => {
            console.log(error)
        });

    var response = {};
    // to show header and description based on claim type
    claim_msg_type = response['claim-msg-type'] // to set the message shown based on status
    trackMessagesArr = response['trackMessages']  // to populate dropdown

    // var x = dummyRefNumberTest() // for testing





    /*before api ingtrn*/


    // var response = {};
    // claim_type = response['claim-type']         // to show header and description based on claim type
    // claim_msg_type = response['claim-msg-type'] // to set the message shown based on status
    // trackMessagesArr = response['trackMessages']  // to populate dropdown

    // var x = dummyRefNumberTest() // for testing
    // if (x == false) {
    //     $('#refNoWarning').modal('show');
    // }
    // else {
    //     displayDateForClaimStatus()
    //     $("#img_claim").hide();
    //     $("#claim").hide();
    //     $("#reference_No").hide();
    //     $("#err_recaptcha").text('');
    //     $("#err_recaptcha").hide();
    //     $("#reference-divider").show();
    //     $("#process_confirmation1").show();
    //     setClaimProgressScreen(); // to set header title and image for claim status screen
    //     trackProgressDropDown(trackMessagesArr) // for tracking progress dropdown
    // }
}

// to set header title and image for claim status screen
function setClaimProgressScreen() {
    switch (claim_type.toLowerCase()) {
        case 'accident':
            setClaimProgressScreenHeader('accident')
            break;
        case 'illness':
            setClaimProgressScreenHeader('illness')
            break;
        case 'death':
            setClaimProgressScreenHeader('death')
            break;
        // default: setClaimProgressScreenHeader('accident') // to be removed
        //     break;
    }
}

function setClaimProgressScreenHeader(title) {

    if (title == 'accident') {
        document.getElementById('claim-header-text').innerHTML = 'ACCIDENT';
        document.getElementById('claim-header-desc').innerHTML = 'We have your back and we&#8217;re here to help you focus on your recovery';
        document.getElementById('claim-header-img').src = './assets/images/accidental.png';
        setAccidentClaimStatusMsg()
    }
    else if (title == 'illness') {
        document.getElementById('claim-header-text').innerHTML = 'ILLNESS';
        document.getElementById('claim-header-desc').innerHTML = 'Don’t worry about your medical expenses because we’re here for you.';
        document.getElementById('claim-header-img').src = './assets/images/illness.png';
        setIllnessClaimStatusMsg()
    }
    else if (title == 'death') {
        document.getElementById('claim-header-text').innerHTML = 'DEATH';
        document.getElementById('claim-header-desc').innerHTML = 'Nothing can be harder than losing someone close to us, that’s why we’re here to help you in this trying time.';
        document.getElementById('claim-header-img').src = './assets/images/death.png';
        setDeathClaimStatusMsg()
    }
}


// functions to set the message for each claim status //
function setAccidentClaimStatusMsg() {

    if (sourceSystem.toLowerCase() == 'tips') {

        if (docsPending == 'Y') {
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });

            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
            twoStepperActive();
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We are glad to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'

                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "block";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now as your policy doesn’t cover Accident coverage. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ', and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ' . We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now as the circumstances that led to your current condition are not included in the provisions of your AIA Philam Life policy. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ' , and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted, and we regret to inform you that we are unable to grant your claim request right now as your AIA Philam Life policy does not cover the condition for which you are claiming a benefit. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ', and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. </p> <br /> <p class="font-weight-normal request-font"> Upon checking, your coverage and all its benefits have ended last //Lapsation date// due to non-payment of premium dues. Please let us know if you wish to discuss this in detail so we can assist how you may be able to reinstate your policy so you can enjoy continued protection. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. If you have any questions or concerns regarding this matter, or you’d like to know how we can reinstate your policy, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }

        }
    }
    else if (sourceSystem.toLowerCase() == 'cms') {
        if (docsPending == 'Y') {
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });

            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
            twoStepperActive();
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We are glad to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'

                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "block";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p  class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your policy doesn’t cover Accident coverage. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p> <br /> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your AIA Philam Life policy does not cover the condition for which you are claiming a benefit. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br/>  <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '.We have reviewed the documents you submitted, and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as the circumstances that led to your current condition are not included in the provisions of your AIA Philam Life policy. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your coverage and all its benefits have ended last //Lapsation Date// due to non-payment of premium dues. </p> <br /> <p class="font-weight-normal request-font"> We’re sorry for this news, ' + claimantFirstName + ', and we continue to wish you a speedy recovery. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions or concerns regarding this matter, or you’d like to know how we can reinstate your policy, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }

        }
    }

    //before integration//
    // switch (claim_msg_type) {
    //     case 'A-1':

    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('A-1').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "block";
    //         document.getElementById("payment-ref").style.display = "none";
    //         twoStepperActive()

    //         break;
    //     case 'A-2':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('A-2').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         document.getElementById("payment-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     case 'A-3':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('A-3').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         document.getElementById("payment-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     case 'A-4':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('A-4').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         document.getElementById("payment-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     case 'A-5':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('A-5').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         document.getElementById("payment-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     default: document.getElementById('claim-msg-text').innerHTML = 'No message found'
    //         break;
    // }
}
function setIllnessClaimStatusMsg() {
    if (sourceSystem.toLowerCase() == 'tips') {

        if (docsPending == 'Y') {

            twoStepperActive();
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });
            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We are glad to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'

                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "block";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now as your policy doesn’t cover Illness coverage. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ', and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ' . We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now as the circumstances that led to your current condition are not included in the provisions of your AIA Philam Life policy. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ' , and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted, and we regret to inform you that we are unable to grant your claim request right now as your AIA Philam Life policy does not cover the condition for which you are claiming a benefit. Please let us know if you wish to discuss this in detail. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + ', and while we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We hope that you are on your way to a speedy recovery. However, we have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. </p> <br /> <p class="font-weight-normal request-font"> Upon checking, your coverage and all its benefits have ended last //Lapsation date// due to non-payment of premium dues. Please let us know if you wish to discuss this in detail so we can assist how you may be able to reinstate your policy so you can enjoy continued protection. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. If you have any questions or concerns regarding this matter, or you’d like to know how we can reinstate your policy, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
        }
    }
    else if (sourceSystem.toLowerCase() == 'cms') {
        if (docsPending == 'Y') {
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });

            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
            twoStepperActive();
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We are glad to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'

                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "block";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your policy doesn’t cover Illness coverage. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your AIA Philam Life policy does not cover the condition for which you are claiming a benefit. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p><br/> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '.We have reviewed the documents you submitted, and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as the circumstances that led to your current condition are not included in the provisions of your AIA Philam Life policy. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> While we can’t release a payment for this claim, we can assure you that your life insurance coverage remains intact for the future. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '. We have reviewed the documents you submitted and we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your coverage and all its benefits have ended last //Lapsation Date// due to non-payment of premium dues. </p> <br /> <p class="font-weight-normal request-font"> We’re sorry for this news, ' + claimantFirstName + ', and we continue to wish you a speedy recovery. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. </p> <br /> <p class="font-weight-normal request-font"> If you have any questions or concerns regarding this matter, or you’d like to know how we can reinstate your policy, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }

        }
    }




    // switch (claim_msg_type) {
    //     case 'I-1':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('I-1').innerHTML;
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         document.getElementById("payment-ref").style.display = "none";
    //         twoStepperActive()
    //         break;
    //     case 'I-2':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('I-2').innerHTML;
    //         document.getElementById("payment-ref").style.display = "block"; // to display payment box
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     case 'I-3':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('I-3').innerHTML;
    //         document.getElementById("payment-ref").style.display = "block";
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     default: document.getElementById('claim-msg-text').innerHTML = 'No message found'
    //         break;
    // }

}
function setDeathClaimStatusMsg() {
    if (sourceSystem.toLowerCase() == 'tips') {

        if (docsPending == 'Y') {
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });
            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
            twoStepperActive();
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                if (beneficiaryType.toLowerCase() == 's') {
                    document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We would like to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'
                    document.getElementById("turnaround-time-ref").style.display = "none";
                    document.getElementById("payment-ref").style.display = "block";
                }
                else {
                    document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR PAYOUT HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> We would like to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive the benefit through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'
                    document.getElementById("turnaround-time-ref").style.display = "none";
                    document.getElementById("payment-ref").style.display = "none";
                }

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {

                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ' , first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now as your policy doesn’t have Death coverage. </p> <br /> <p class="font-weight-normal request-font"> Please let us know if you wish to discuss this in detail. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ' , first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now as the conditions do not meet the policy’s provisions. </p> <br /> <p class="font-weight-normal request-font"> Please let us know if you wish to discuss this in detail. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now as the circumstances in the situation are not included in your policy contract. </p> <br /> <p class="font-weight-normal request-font"> Please let us know if you wish to discuss this in detail. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. </p> <br /> <p class="font-weight-normal request-font"> Upon checking, your coverage and all its benefits have ended last //Lapsation date// due to non-payment of premium dues. Please let us know if you wish to discuss this in detail so we can assist how you may be able to reinstate your policy so you can enjoy continued protection. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. If you have any questions or concerns regarding this matter, you may chat with Aya of AIA Philam Life on Facebook Messenger or Viber. You may also contact or customer hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
        }
    }
    else if (sourceSystem.toLowerCase() == 'cms') {
        if (docsPending == 'Y') {
            var finalDocsList = '';
            requirementsList.forEach(function (item) {
                finalDocsList = finalDocsList + '<div style="display: flex;align-items: center; padding-bottom: 1px;"> <div id="outer-circle"> <div id="inner-circle"></div> </div> <p>' + item.name + '</p> </div>'

            });

            document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR OTHER CLAIMS DOCUMENTS</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '.We have reviewed your initial claim request submission and identified that we may need the following documents for us to proceed: </p > <br /> <p class="font-weight-normal request-font"> <div style="padding-left: 10px;"> ' + finalDocsList + '</div> </p> <br /> <p class="font-weight-normal request-font"> Don&#39;t worry, you can easily submit these documents to your Financial Advisor so we can proceed with your claim request.You may also submit your documents to any AIA Philam Life Customer Service Center near you.To find the nearest branch, please click <a href = ""> here <link of Philam Life CSC branches in website> </a>. </p> </div>';
            document.getElementById("turnaround-time-ref").style.display = "block";
            document.getElementById("payment-ref").style.display = "none";
            twoStepperActive();
        }
        else {
            if (claimStatus.toLowerCase() == 'received') {
                document.getElementById('claim-msg-text').innerHTML = ' <div> <h3>YOUR REQUEST IS BEING PROCESSED</h3> <br /> <p class="font-weight-justy request-font"> Hang in there as we are now processing your request. Kindly expect an SMS update from us within 1 to 2 working days on the status of your request. </p> <br /> <p class="font-weight-normal request-font"> If we would need additional documents to support your request, we will reach out to you immediately. </p> <br /> <p class="font-weight-normal request-font"> You may also check the progress of your request <a href="main.html">here</a>. Just type in your reference number ' + transactionNumber + ' to view the status of your request. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "block";
                document.getElementById("payment-ref").style.display = "none";
                twoStepperActive();
            }
            else if (claimStatus.toLowerCase() == 'approved') {
                if (beneficiaryType.toLowerCase() == 's') {
                    document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + '. We would like to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive ' + currency + ' ' + claimAmount + ' through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'
                    document.getElementById("turnaround-time-ref").style.display = "none";
                    document.getElementById("payment-ref").style.display = "block";
                }
                else {
                    document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR PAYOUT HAS BEEN APPROVED</h3> <br /> <p class="font-weight-justy request-font"> We would like to let you know that we have approved your claim request for your AIA Philam Life policy no. ' + policyNumber + '. </p> <br /> <p class="font-weight-normal request-font"> Kindly expect to receive the benefit through your chosen payout method. Please expect an update from us on when your benefit will be released. </p> <br /> <p class="font-weight-normal request-font"> We have also sent this information via SMS for your reference. </p> </div>'
                    document.getElementById("turnaround-time-ref").style.display = "none";
                    document.getElementById("payment-ref").style.display = "none";
                }
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied1') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your policy doesn’t have Death coverage. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";

                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied2') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. </p> <br /> <p class="font-weight-normal request-font"> Upon checking, your coverage and all its benefits have ended last //Lapsation date// due to non-payment of premium dues. Please let us know if you wish to discuss this in detail so we can assist how you may be able to reinstate your policy so you can enjoy continued protection. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. If you have any questions or concerns regarding this matter, you may chat with Aya of AIA Philam Life on Facebook Messenger or Viber. You may also contact or customer hotline at (02)8528-2000. </p> </div> //cms// <div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + '.first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your policy doesn’t have Death coverage. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied3') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem since your policy doesn’t have Death coverage. </p> <br /> <p class="font-weight-normal request-font"> We understand that you’re going through a tough time, ' + claimantFirstName + '. Please let us know if you wish to discuss this in detail so we can assist in providing you alternative options. You may reach us through our Customer Hotline at (02)8528-2000 or you may discuss your concern with your financial advisor. </p> <br /> <p class="font-weight-normal request-font"> If you have other questions, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }
            else if (claimStatus.toLowerCase() == 'denied4') {
                document.getElementById('claim-msg-text').innerHTML = '<div> <h3>YOUR REQUEST HAS BEEN DENIED</h3> <br /> <p class="font-weight-justy request-font"><p> Sorry, there seems to be a problem.</p><br /> Hi ' + claimantFirstName + ', first of all, we would like to extend our deepest sympathies for your loss. However, after reviewing the documents you submitted, we regret to inform you that we are unable to grant your claim request right now. There seems to be a problem as your coverage and all its benefits have ended last //Lapsation Date// due to non-payment of premium dues. </p> <br /> <p class="font-weight-normal request-font"> We are sorry for this news and we understand that you’re going through a tough time, ' + claimantFirstName + '. If you wish to discuss more about your claim request, or if you’d like to know how we can reinstate your policy, you may reach out to us by chatting Aya of AIA Philam Life on Facebook Messenger or sending us an e-mail at philamlife@aia.com. You may also call us at our Customer Hotline at (02)8528-2000. </p> </div>'
                document.getElementById("turnaround-time-ref").style.display = "none";
                document.getElementById("payment-ref").style.display = "none";
                allStepperActive()
            }

        }
    }


    // switch (claim_msg_type) {
    //     case 'D-1':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('D-1').innerHTML;
    //         document.getElementById("payment-ref").style.display = "block";
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     case 'D-2':
    //         document.getElementById('claim-msg-text').innerHTML = document.getElementById('D-2').innerHTML;
    //         document.getElementById("payment-ref").style.display = "block";
    //         document.getElementById("turnaround-time-ref").style.display = "none";
    //         allStepperActive()
    //         break;
    //     default: 'No message'
    //         break;
    // }
}
// functions to set the message for each claim status //

//-----functions for stepper-----//

//function to be called if all three steps are to be highlighted//
function allStepperActive() {
    $("#step1").addClass("active");
    $("#step2").addClass("active");
    $("#step3").addClass("active");
    $("#step3").addClass("done");
    document.getElementById('step-circle-1').style.backgroundColor = "#8bc435";
    document.getElementById('step-circle-1').style.borderColor = "#8bc435";
    document.getElementById('step-circle-2').style.backgroundColor = "#8bc435";
    document.getElementById('step-circle-2').style.borderColor = "#8bc435";
    document.getElementById('step-circle-3').style.backgroundColor = "#8bc435";
    document.getElementById('step-circle-3').style.borderColor = "#8bc435";


    document.getElementById('step-circle-title-1').style.color = 'black';
    document.getElementById('step-circle-title-2').style.color = 'black';
    document.getElementById('step-circle-title-3').style.color = '#8bc435';
    //change stepper bar colour based on status//
    document.getElementById('step-circle-1').style.width = '20px';
    document.getElementById('step-circle-1').style.height = '20px';
    document.getElementById('step-circle-2').style.width = '20px';
    document.getElementById('step-circle-2').style.height = '20px';
    //change stepper bar colour based on status//
    document.getElementById('step-bar-1').style.border = '1px solid #8bc435'
    document.getElementById('step-bar-2').style.border = '1px solid #8bc435'
    document.getElementById('step-bar-3').style.border = '1px solid #8bc435'
    document.getElementById('step-bar-4').style.border = '1px solid #8bc435'


}

//function to be called if only two steps are to be highlighted//
function twoStepperActive() {
    $("#step1").addClass("active");
    $("#step2").addClass("active");
    $("#step3").addClass("done");
    document.getElementById('step-circle-1').style.backgroundColor = "#b8123e";
    document.getElementById('step-circle-1').style.borderColor = "#b8123e";
    document.getElementById('step-circle-2').style.backgroundColor = "#b8123e";
    document.getElementById('step-circle-2').style.borderColor = "#b8123e";

    document.getElementById('step-circle-title-1').style.color = 'black';
    document.getElementById('step-circle-title-2').style.color = 'black';
    document.getElementById('step-circle-title-3').style.color = '#c7c2c2';

    document.getElementById('step-circle-3').style.backgroundColor = "#c7c2c2";
    document.getElementById('step-circle-3').style.borderColor = "#c7c2c2";
    //change stepper circle size based on status//
    document.getElementById('step-circle-1').style.width = '20px';
    document.getElementById('step-circle-1').style.height = '20px';
    document.getElementById('step-circle-2').style.width = '20px';
    document.getElementById('step-circle-2').style.height = '20px';
    //change stepper bar colour based on status//
    document.getElementById('step-bar-1').style.border = '1px solid rgb(184, 18, 62)'
    document.getElementById('step-bar-2').style.border = '1px solid rgb(184, 18, 62)'

}
/* -------functions for stepper------ */

function trackProgressDropDown(trackMessagesArr) {
    var final_progress_result = ''
    final_progress_result = '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[0]['msg'] + claim_type.toLowerCase() + '</div></div></div>' +
        '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[1]['msg'] + '</div></div></div>' +
        (claim_type == 'Accident' || claim_type == 'Illness' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + 'You have chosen ' + disbursementType + ' as a preferred payout method' + '</div></div></div>' :
            beneficiaryType == 'S' ?
                '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + 'You have chosen ' + disbursementType + ' as a preferred payout method' + '</div></div></div>' :
                '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + 'You have chosen your preferred payout methods.' + '</div></div></div>')
        + (claimStatus.toLowerCase() == 'received' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[4]['msg'] + '</div></div></div>' : '') +
        (docsPending.toLowerCase() == 'y' && docsReceived.toLowerCase() == 'n' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[5]['msg'] + '</div></div></div>' :
            (docsPending.toLowerCase() == 'n' && docsReceived.toLowerCase() == 'y' ?
                '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[5]['msg'] + '</div></div></div>' +
                '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[6]['msg'] + '</div></div></div>' : docsPending.toLowerCase() == 'y' && docsReceived.toLowerCase() == 'y' ? '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[5]['msg'] + '</div></div></div>' + '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[6]['msg'] + '</div></div></div>' : ''))
        + (claimStatus == 'denied1' || claimStatus == 'denied2' || claimStatus == 'denied3' || claimStatus == 'denied4' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[7]['msg'] + '</div></div></div>' :
            '')
        + (claimStatus == 'approved' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[8]['msg'] + '</div></div></div>' + '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[11]['msg'] + '</div></div></div>' :
            '')
        + (claimStatus == 'approved' && disbursementType == 'CTA' && beneficiaryType.toLowerCase() == 's' ?
            '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[12]['msg'] + '</div></div></div>'
            : claimStatus == 'approved' && disbursementType == 'PUA' && beneficiaryType.toLowerCase() == 's' ? '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + progress_msges[9]['msg'] + '</div></div></div>' : '')
    document.getElementById('progs-status').innerHTML = final_progress_result

    //--before integration--//

    //to be reomvesd -testing
    // if (claim_msg_type == 'A-1') {
    //     trackMessagesArr = [1, 4, 5, 7, 8] // for testing - to be removed
    // }
    // if (claim_msg_type == 'I-2') {
    //     trackMessagesArr = [2, 4, 6, 7, 8, 9, 11] // for testing - to be removed
    // }

    // if (claim_msg_type == 'D-2') {
    //     trackMessagesArr = [3, 4, 6, 7, 11, 12] // for testing - to be removed
    // }
    // else {
    //     trackMessagesArr = [1, 4, 5, 7, 8] // for testing - to be removed
    // }
    //to be reomved -testing

    // var finaltext = '';
    // trackMessagesArr.forEach(function (item) {
    //     progress_msges.forEach(function (msg) {
    //         if (item == msg['id']) {
    //             finaltext = finaltext + '<div class="step step-active"><div><div class="circle " id="circle2"><i class="fa fa-check" ></i ></div ></div><div><div class="title">' + msg['msg'] + '</div></div></div>'
    //             // break;
    //         }

    //     })

    // });


    // console.log('finaltext' + finaltext)
    // document.getElementById('progs-status').innerHTML = final_progress_result // set the populated dropdown details to html
}


/* function to display date at top in the claim status screen */

function displayDateForClaimStatus() {
    var date = new Date();

    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    };

    var x = date.toLocaleDateString("en", options);
    var parts = x.split(',');
    var day = parts[0];
    var mnthDate = parts[1].split(' ')[1];
    var year = parts[2];
    var time = parts[3];
    var finalDate = day + ' ' + date.getDate() + ' ' + mnthDate + year + ' at ' + time;
    document.getElementById("displayDt").innerHTML = finalDate
}



function selectAnswer(quesn_num, id, selectedOption) {

    var idList = ['a11', 'a12', 'a13', 'a14', 'a15', 'a21', 'a22', 'a23', 'a24', 'a25', 'a31', 'a32', 'a33',
        'a34', 'a35', 'a36', 'a37', 'a38', 'a39', 'a310'];
    if (quesn_num == 1) {
        for (var i = 0; i <= 4; i++) {
            if ($('#' + idList[i]).hasClass('survey_btn_selected')) {
                $('#' + idList[i]).removeClass('survey_btn_selected');
                $('#' + idList[i]).addClass('survey_btn');
            }
        }
    }
    else if (quesn_num == 2) {

        for (var i = 5; i <= 9; i++) {
            if ($('#' + idList[i]).hasClass('survey_btn_selected')) {
                $('#' + idList[i]).removeClass('survey_btn_selected');
                $('#' + idList[i]).addClass('survey_btn');
            }
        }

    }
    else if (quesn_num == 3) {

        for (var i = 10; i <= 19; i++) {
            if ($('#' + idList[i]).hasClass('survey_btn_selected')) {
                $('#' + idList[i]).removeClass('survey_btn_selected');
                $('#' + idList[i]).addClass('survey_btn');
            }
        }

    }

    if ($('#' + id).hasClass('survey_btn_selected')) { $('#' + id).removeClass('survey_btn_selected'); }
    else {
        if ($('#' + id).hasClass('survey_btn')) {
            $('#' + id).removeClass('survey_btn');
            $('#' + id).addClass('survey_btn_selected');
        }
        else {
            $('#' + id).addClass('survey_btn_selected');

        }

    }
    if (quesn_num == 1) {
        surveyQues1 = 'surveyQuestion1';
        surveyAns1 = selectedOption
    }
    else if (quesn_num == 2) {
        surveyQues2 = 'surveyQuestion2';
        surveyAns2 = selectedOption
    }
    else if (quesn_num == 3) {
        surveyQues3 = 'surveyQuestion3';
        surveyAns3 = selectedOption
    }
    surveyObj = { 'surveyQuestion1': surveyAns1, 'surveyQuestion2': surveyAns2, 'surveyQuestion3': surveyAns3 }


}

function submit_survey(event) {
    event.preventDefault();
    var survey_data = {};
    survey_data['companyName'] = 'PAL';
    survey_data['TIPSReferenceNumber'] = referenceNumber;
    survey_data['sourceSystem'] = sourceSystem;
    survey_data['surveyQuestion1'] = surveyAns1;
    survey_data['surveyQuestion2'] = surveyAns2;
    survey_data['surveyQuestion3'] = surveyAns3;

    // let surveyData = {
    //     stageOne: true,
    //     type: "survey",
    //     referenceNumber: referenceNumber,
    //     data: survey_data
    // }
    window.parent.postMessage(JSON.stringify({
        event_code: 'ym-client-event', data: JSON.stringify({
            event: {
                code: "customerSurvey",
                data: JSON.stringify(survey_data)
            }
        })
    }), '*');
    window.addEventListener('message', function (event) {
      
        console.log("receiving survey event in acc")
        console.log(event.data.event_code)
        try {
            debugger
            if (JSON.parse(event.data)) {
                if (event.data.returnCode == '0') { //sucess
                    var nodes = document.getElementById("customer_survey").getElementsByTagName('*');
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].disabled = true;
                        nodes[i].style.cursor = 'no-drop'

                    }
                    document.getElementById("customer_survey").style.opacity = '0.65'
                }
                else {

                }
            }
        } catch (error) {
            console.log(error)
        }

    })




    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // var raw = JSON.stringify({
    //     "companyName": "PAL", "TIPSReferenceNumber": referenceNumber,
    //     "sourceSystem": sourceSystem,
    //     "surveyQuestion1": surveyAns1,
    //     "surveyQuestion2": surveyAns2,
    //     "surveyQuestion3": surveyAns3
    // });
    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw
    // };
    // fetch("http://localhost:3000/survey", requestOptions).then((response) => response.json())
    //     .then(response => {

    //         if (response.returnCode == '0') {

    //             var nodes = document.getElementById("customer_survey").getElementsByTagName('*');
    //             for (var i = 0; i < nodes.length; i++) {
    //                 nodes[i].disabled = true;
    //                 nodes[i].style.cursor = 'no-drop'

    //             }
    //             document.getElementById("customer_survey").style.opacity = '0.65'
    //         }

    //     }).catch(error => {
    //         console.log(error)
    //     });
}
