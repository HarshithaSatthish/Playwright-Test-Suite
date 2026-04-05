export const testData = {
  taskBot: {
    namePrefix: "PW_TaskBot_",
    messageBoxText: "Playwright automation validation message",
  },
  form: {
    namePrefix: "PW_Form_",
    textboxLabel: "Customer Name",
  },
  api: {
    learningInstanceNamePrefix: "PW_LI_",
    /** Payload for POST learning instance — add required fields if your tenant's API rejects this shape. */
    learningInstance: {
      name: "",
      description: "Created by Playwright API automation",
      locale: "en_US",
    },
  },
};
