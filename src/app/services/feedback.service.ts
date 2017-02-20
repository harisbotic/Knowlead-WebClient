import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { P2PFeedbackModel } from '../models/dto';
import { FEEDBACK_P2P } from '../utils/urls';

@Injectable()
export class FeedbackService {

  constructor(protected http: Http) { }

  giveP2pFeedback(feedback: P2PFeedbackModel) {
    return this.http.post(FEEDBACK_P2P, feedback);
  }

}
