from transformers import LEDForConditionalGeneration, LEDTokenizer
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = LEDTokenizer.from_pretrained("allenai/led-large-16384-arxiv")
model = LEDForConditionalGeneration.from_pretrained("allenai/led-large-16384-arxiv", return_dict_in_generate=True).to(device)

def summarize(content): 
    content = content.replace("\\", "")
    index = content.find("See also")
    if index != -1:
        content = content[:index]
    input_ids = tokenizer(content, return_tensors="pt").input_ids.to(device)
    global_attention_mask = torch.zeros_like(input_ids)
    global_attention_mask[:, 0] = 1
    sequences = model.generate(input_ids, global_attention_mask=global_attention_mask).sequences
    summary = tokenizer.batch_decode(sequences)
    return summary
