export let assistantId = "asst_sbXCfzTacFRx54zvAmCtkoYB"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
