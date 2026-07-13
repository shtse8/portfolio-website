pub const SYSTEM_PROMPT: &str = include_str!("persona.txt");
#[cfg(test)]
mod fleet_web_finish_wave8_tests {
    use super::SYSTEM_PROMPT;

    #[test]
    fn system_prompt_non_empty_and_names_kyle() {
        assert!(SYSTEM_PROMPT.len() > 100);
        assert!(
            SYSTEM_PROMPT.to_ascii_lowercase().contains("kyle")
                || SYSTEM_PROMPT.contains("portfolio"),
            "persona missing identity markers"
        );
    }
}
