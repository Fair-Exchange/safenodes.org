import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';

declare var keyGenerate;
import '../../assets/compress.js';

@Component({
    selector: 'app-generate-wallet',
    templateUrl: './generate-wallet.component.html',
    styleUrls: ['./generate-wallet.component.less']
})

export class GenerateWalletComponent implements OnInit {

    cdr;
    showKey = false;
    passwordFail = false;
    SafeWifTextQRCode = 'DEFAULT';
    SafeAddressTextQRCode = 'DEFAULT';
    SafeKeyTextQRCode = 'DEFAULT';
    SafePrivateKeyTextQRCode = 'DEFAULT';

    RavenAddressTextQRCode = 'DEFAULT';
    RavenWifTextQRCode = 'DEFAULT';

    BTCAddressTextQRCode = 'DEFAULT';
    BTCWifTextQRCode = 'DEFAULT';

    BTGAddressTextQRCode = 'DEFAULT';
    BTGWifTextQRCode = 'DEFAULT';

    @ViewChild('SafeAddressQRCode') SafeAddressQRCode: any;
    @ViewChild('SafeWifQRCode') SafeWifQRCode: any;

    @ViewChild('SafeKeyQRCode') SafeKeyQRCode: any;
    @ViewChild('SafePrivateKeyQRCode') SafePrivateKeyQRCode: any;

    @ViewChild('RavenAddressQRCode') RavenAddressQRCode: any;
    @ViewChild('RavenWifQRCode') RavenWifQRCode: any;

    @ViewChild('BTCAddressQRCode') BTCAddressQRCode: any;
    @ViewChild('BTCWifQRCode') BTCWifQRCode: any;

    @ViewChild('BTGAddressQRCode') BTGAddressQRCode: any;
    @ViewChild('BTGWifQRCode') BTGWifQRCode: any;

    constructor(private CDR: ChangeDetectorRef) {
        this.cdr = CDR;

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
            const passwordConfirm = $(this).find( 'input[name=\'password_confirm\']' ).val();

            // Check password
            if (password === passwordConfirm) {
                keyGenerate.hash(password, (err, keys) => {
                    _SELF.generateKeys(keys);
                });
            } else {
                $('#passwordStrength').removeClass().addClass('alert alert-danger').html('Passwords are not identical');
            }
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

                // Must be at least 20 characters long
                const okRegex = new RegExp('(?=.{20,}).*', 'g');

                $('#sendForm').prop('disabled', true );

                const val = $(this).val().toString();

                if (okRegex.test(val) === false) {
                    // If ok regex doesn't match the password
                    $('#passwordStrength').removeClass().addClass('alert alert-danger').html('Password must be 20 characters long or more.');
                } else if (strongRegex.test(val)) {
                    // If reg ex matches strong password
                    $('#passwordStrength').removeClass().addClass('alert alert-success').html('Good Password!');
                    $('#sendForm').prop('disabled', false);
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

    generateKeys(keyGenerated: any): void {

        this.showKey = true;

        this.SafeAddressTextQRCode = keyGenerated.safeAddress ;
        this.SafeAddressQRCode.value = keyGenerated.safeAddress ;
        this.SafeAddressQRCode.generate();

        this.SafeWifTextQRCode = keyGenerated.safeWIF ;
        this.SafeWifQRCode.value = keyGenerated.safeWIF ;
        this.SafeWifQRCode.generate();

        this.SafeKeyTextQRCode = keyGenerated.safeKey ;
        this.SafeKeyQRCode.value = keyGenerated.safeKey ;
        this.SafeKeyQRCode.generate();

        this.SafePrivateKeyTextQRCode = keyGenerated.safePrivateKey ;
        this.SafePrivateKeyQRCode.value = keyGenerated.safePrivateKey ;
        this.SafePrivateKeyQRCode.generate();

        this.RavenAddressTextQRCode = keyGenerated.rvnAddress ;
        this.RavenAddressQRCode.value = keyGenerated.rvnAddress ;
        this.RavenAddressQRCode.generate();

        this.RavenWifTextQRCode = keyGenerated.rvnWIF ;
        this.RavenWifQRCode.value = keyGenerated.rvnWIF ;
        this.RavenWifQRCode.generate();

        this.BTCAddressTextQRCode = keyGenerated.btcAddress ;
        this.BTCAddressQRCode.value = keyGenerated.btcAddress ;
        this.BTCAddressQRCode.generate();

        this.BTCWifTextQRCode = keyGenerated.btcWIF ;
        this.BTCWifQRCode.value = keyGenerated.btcWIF ;
        this.BTCWifQRCode.generate();

        this.BTGAddressTextQRCode = keyGenerated.btgAddress ;
        this.BTGAddressQRCode.value = keyGenerated.btgAddress ;
        this.BTGAddressQRCode.generate();

        this.BTGWifTextQRCode = keyGenerated.btgWIF ;
        this.BTGWifQRCode.value = keyGenerated.btgWIF ;
        this.BTGWifQRCode.generate();

        this.cdr.detectChanges();

        this.print();
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
