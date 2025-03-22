from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import Dataset
import torch
from huggingface_hub import login

def fine_tuned_model():
    token = "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"
    login(token)

    file_path = "ai_models/datasets/frontend_full_info.txt"
    with open(file_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    text_chunks = [raw_text[i:i+2048] for i in range(0, len(raw_text), 2048)]
    dataset = Dataset.from_dict({"text": text_chunks})

    model_name = "mistralai/Mistral-7B-Instruct-v0.1"
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    def preprocess_function(examples):
        return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=2048)

    tokenized_dataset = dataset.map(preprocess_function, batched=True, remove_columns=["text"])

    training_args = TrainingArguments(
        output_dir="./miketrika_mistral_raw",
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60,
        learning_rate=2e-4,
        fp16=False,
        logging_steps=1,
        save_steps=20,
        save_total_limit=2,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
    )

    trainer.train()

    model.save_pretrained("./miketrika_mistral_raw")
    tokenizer.save_pretrained("./miketrika_mistral_raw")

    print("Modèle fine-tuné sur texte brut sauvegardé dans ./miketrika_mistral_raw")
    
