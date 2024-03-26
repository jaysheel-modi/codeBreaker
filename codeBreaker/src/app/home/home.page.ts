import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private http: HttpClient, private alertControl: AlertController) { }

  codeBreaker = {
    op1: '',
    op2: '',
    op3: '',
    op4: '',
  }
  count = 0
  isDisabled: boolean = false
  gameRestart: boolean = false
  max = 10
  lastCodes: { color: string; result: string }[][] = []
  feedbackCount: { blackCount: number, whiteCount: number }[] = []
  errorLabel = ""

  ngOnInit() {
    this.http.get("http://127.0.0.1:8887/createCode").subscribe((res: any) => {
    })
  }

  verifyColor() {
    if (this.codeBreaker.op1 !== '' && this.codeBreaker.op2 !== '' && this.codeBreaker.op3 !== '' && this.codeBreaker.op4 !== '') {
      this.gameRestart = false;
      this.http.get("http://127.0.0.1:8887/retrieve", { params: this.codeBreaker }).subscribe((res: any) => {
        this.count++;
        if (this.count >= this.max) {
          this.isDisabled = true
          this.alertAction("Thanks for playing", "Unfortunately, you ran out of turns in the Code Breaker competition.");
        }

        this.lastCodes.push(res.result);
        const bwcount = { blackCount: 0, whiteCount: 0 }
        for (let i = 0; i < res.result.length; i++) {
          if (res.result[i].result === 'B') {
            bwcount.blackCount += 1;
          } else if (res.result[i].result === 'W') {
            bwcount.whiteCount += 1;
          }
        }
        this.feedbackCount.push(bwcount)
        if (res.msg == "winner") {
          this.alertAction("Congratulations on winning the Code Breaker competition!", "Your exceptional skills and strategic thinking have led you to victory. Well done!");
        }

        this.codeBreaker.op1 = '';
        this.codeBreaker.op2 = '';
        this.codeBreaker.op3 = '';
        this.codeBreaker.op4 = '';
      })
    } else {
      this.errorLabel = "Please select all the option"
    }
  }

  resetGame() {
    this.ngOnInit()
    this.gameRestart = true;
    this.isDisabled = false;
    this.lastCodes = []
    this.feedbackCount = []
    this.count = 0
  }

  async alertAction(header: string, message: string) {
    const alert = await this.alertControl.create({
      header: header,
      subHeader: '',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.resetGame()
          }
        }]
    });
    await alert.present();
  }



}
