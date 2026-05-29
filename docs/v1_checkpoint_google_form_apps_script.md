# Google Forms Apps Script: V1 Checkpoint Feedback

I cannot directly create a hosted Google Form from this workspace without access to your Google account, but this script will create one for you.

## How To Use

1. Go to `https://script.google.com`.
2. Create a new project.
3. Paste the script below into `Code.gs`.
4. Click Run.
5. Approve permissions.
6. Check the execution log for the form URL and linked spreadsheet URL.

```javascript
function createV1CheckpointFeedbackForm() {
  const form = FormApp.create('Canadian Retirement Planner V1 Checkpoint Feedback');
  form.setDescription(
    'Please use example or fictional data only. This review is about product clarity, trust, and usability. It is not financial advice.'
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage('Thank you. Your feedback has been recorded.');

  const addScale = (title, low, high) => {
    form.addScaleItem()
      .setTitle(title)
      .setBounds(1, 5)
      .setLabels(low, high);
  };

  const addChoice = (title, choices) => {
    form.addMultipleChoiceItem()
      .setTitle(title)
      .setChoiceValues(choices);
  };

  form.addSectionHeaderItem().setTitle('Tester Info');
  form.addTextItem().setTitle('Tester name or initials').setRequired(false);
  addChoice('Tester type', [
    'Non-expert consumer',
    'Financial/planning professional',
    'Developer/model reviewer',
    'Other'
  ]);
  addChoice('Device used', ['Desktop/laptop', 'Tablet', 'Phone', 'Multiple devices']);
  form.addParagraphTextItem().setTitle('Examples tested').setHelpText('List the built-in examples or plan types you tested.');

  form.addSectionHeaderItem().setTitle('First Results Screen');
  addScale('Could you answer “Can I retire?” within 60 to 90 seconds?', 'No, not at all', 'Yes, clearly');
  form.addParagraphTextItem().setTitle('What did the first Results screen tell you in your own words?');
  addScale('How clear was the spending estimate?', 'Confusing', 'Clear and appropriately cautious');
  addScale('Was the after-tax monthly spending number prominent enough?', 'Hard to find', 'Clearly visible');
  addChoice('Did spending language feel like a planning estimate rather than a guarantee?', ['Yes', 'Mostly', 'No', 'Not sure']);
  addScale('Did the explanation that spending can change with age make sense?', 'Confusing', 'Clear');
  addChoice('Did the spending breakpoint ages feel like optional assumptions you could adjust and rerun?', [
    'Yes',
    'Mostly',
    'No',
    'Not sure'
  ]);
  addChoice('Would it be clearer if intake asked for minimum monthly expenses, excluding mortgage, instead of desired retirement spending?', [
    'Yes',
    'Maybe',
    'No',
    'Not sure'
  ]);
  form.addParagraphTextItem()
    .setTitle('If minimum expenses were not covered, which options would you expect to compare first?')
    .setHelpText('Examples: lower expenses, work longer, downsize, save more, adjust benefit timing, review tax, revisit estate intent.');
  addScale('Did the Details minimum-expense bridge help explain the relationship between a spending floor and monthly capacity?', 'Confusing', 'Helpful');
  addChoice('Did the bridge wording make clear that this is temporary review evidence, not a saved input or instruction?', [
    'Yes',
    'Mostly',
    'No',
    'Not sure'
  ]);
  addScale('Did the Details spending-path bridge help explain how one monthly answer can still reflect spending changing with age?', 'Confusing', 'Helpful');
  addChoice('Did the spending-path bridge feel secondary enough, or did it add too much detail?', [
    'Secondary enough',
    'A little too much',
    'Too much detail',
    'Not sure'
  ]);
  addScale('Were the top review actions useful?', 'Not useful', 'Very useful');
  form.addParagraphTextItem().setTitle('What, if anything, made the first screen feel too dense or too light?');

  form.addSectionHeaderItem().setTitle('Trust And Safety');
  addScale('Overall trust after using the planner', 'Low trust', 'High trust');
  addChoice('Did anything sound like personalized financial advice?', ['No', 'Maybe', 'Yes']);
  form.addParagraphTextItem().setTitle('If yes or maybe, what wording or screen caused that reaction?');
  addChoice('Did any number feel too precise for a long-term projection?', ['No', 'Maybe', 'Yes']);
  form.addParagraphTextItem().setTitle('What increased your trust most?');
  form.addParagraphTextItem().setTitle('What reduced your trust most?');

  form.addSectionHeaderItem().setTitle('Drawdown, Taxes, Benefits, And Couples');
  addScale('How understandable were the tax and benefit timing sections?', 'Confusing', 'Clear');
  addChoice('Did drawdown or optimizer language feel review-oriented rather than instructional?', ['Yes', 'Mostly', 'No', 'Not sure']);
  addChoice('Did any option feel like it pushed lifestyle cuts, working longer, or delayed benefits too strongly?', ['No', 'Maybe', 'Yes']);
  addChoice('If you tested a couple plan, was survivor or pension-continuation information clear?', ['Yes', 'Mostly', 'No', 'Not tested']);
  form.addParagraphTextItem()
    .setTitle('Any Canadian planning concerns you noticed?')
    .setHelpText('CPP, OAS, RRIF/LIF, DB pensions, survivor assumptions, estate goals, home equity, tax timing, or eligibility.');

  form.addSectionHeaderItem().setTitle('Save, Export, And Local-First Trust');
  addScale('Was the difference between saving an editable plan and opening a printable report clear?', 'Not clear', 'Very clear');
  addScale('Did local-first behavior feel trustworthy?', 'Not trustworthy', 'Very trustworthy');
  form.addParagraphTextItem().setTitle('What, if anything, would make saving/exporting feel safer?');

  form.addSectionHeaderItem().setTitle('Visual And UX Checkpoint');
  addScale('Visual polish today', 'Very rough', 'Very polished');
  form.addParagraphTextItem().setTitle('What visual or layout issues should be fixed before v1?');
  form.addParagraphTextItem().setTitle('What visual or layout issues can wait for the later UX pass?');
  addScale('Were charts and tables easy to understand?', 'Confusing', 'Clear');

  form.addSectionHeaderItem().setTitle('Priority Feedback');
  form.addParagraphTextItem().setTitle('Top 3 things that increased trust');
  form.addParagraphTextItem().setTitle('Top 3 things that reduced trust');
  form.addParagraphTextItem().setTitle('One thing you would fix before showing this to more people');
  addChoice('How should this feedback be classified overall?', [
    'Fix before v1',
    'Review during checkpoint',
    'Later UX pass',
    'No major concerns'
  ]);
  form.addParagraphTextItem().setTitle('Any final comments?');

  const sheet = SpreadsheetApp.create('Canadian Retirement Planner V1 Checkpoint Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Responses sheet URL: ' + sheet.getUrl());
}
```
