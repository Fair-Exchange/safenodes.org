import { Component, ViewChild, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
    selector: 'app-generate-wallet',
    templateUrl: './generate-wallet.component.html',
    styleUrls: ['./generate-wallet.component.less']
})
export class GenerateWalletComponent implements OnInit {

    showKey = false;
    publicTextQRCode = 'DEFAULT';
    privateTextQRCode = 'DEFAULT';

    @ViewChild('publicQRCode') publicQRCode: any;
    @ViewChild('privateQRCode') privateQRCode: any;

    constructor() {

    }

    ngOnInit() {

        // Scope
        const _SELF = this;

        // Attach a submit handler to the form
        $( '#generateWalletForm' ).submit(function( event ) {

            // Stop form from submitting normally
            event.preventDefault();

            // Get some values from elements on the page:
            const password = $(this).find( 'input[name=\'password_input\']' ).val();

            // Send the data using post
            const posting = $.post(
                ':3001',
                { safePass : password }
            );

            // Put the results in a div
            posting.done(res => {

                _SELF.showKey = true;
                console.log('Get back : ', res.data);

                _SELF.publicTextQRCode = res.data.SAFE;
                _SELF.publicQRCode.value = res.data.SAFE;
                _SELF.publicQRCode.generate();

                _SELF.privateTextQRCode = res.data.btcpubkey;
                _SELF.privateQRCode.value = res.data.btcpubkey;
                _SELF.privateQRCode.generate();
            }).fail((jqxhr, textStatus, error) => {

                // Something wrong... Show that
                const err = textStatus + ', ' + error;
                console.log('Request Failed during load withdrawal fees:' + err );
            }).always(() => {

            });
        });

        $(document).ready(() => {

            $('#passwordStrength').removeClass().addClass('alert alert-error').html('A strong password is required');

            $('#safePassword').on('keyup', function(e) {

                // Must have capital letter, numbers and lowercase letters
                const strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g');

                // Must have either capitals and lowercase letters or lowercase and numbers
                const mediumRegex = new RegExp(
                    '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
                    'g');

                // Must be at least 6 characters long
                const okRegex = new RegExp('(?=.{6,}).*', 'g');

                $('#sendForm').prop('disabled', true );

                const val = $(this).val().toString();

                if (okRegex.test(val) === false) {
                    // If ok regex doesn't match the password
                    $('#passwordStrength').removeClass().addClass('alert alert-danger').html('Password must be 6 characters long.');
                } else if (strongRegex.test(val)) {
                    // If reg ex matches strong password
                    $('#passwordStrength').removeClass().addClass('alert alert-success').html('Good Password!');
                    $('#sendForm').prop('disabled',false);
                } else if (mediumRegex.test(val)) {
                    // If medium password matches the reg ex
                    $('#passwordStrength').removeClass().addClass(
                        'alert alert-info'
                    ).html('Make your password stronger with more capital letters, more numbers and special characters!');
                } else {
                    // If password is ok
                    $('#passwordStrength').removeClass().addClass(
                        'alert alert-danger'
                    ).html('Weak Password, try using numbers and capital letters.');
                }

                return true;
            });
        });
    }

    print(): void {
        let printContents;
        let popupWin;

        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
              <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <link rel="stylesheet" href="http://github.hubspot.com/odometer/themes/odometer-theme-minimal.css" />

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans">
    <link href="https://fonts.googleapis.com/css?family=Rubik:400,500" rel="stylesheet">
    <style>
        @media print{
  .doNotPrint{display:none !important;}
}
</style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }
}
