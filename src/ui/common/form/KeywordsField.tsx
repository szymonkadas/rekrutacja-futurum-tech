import { type KeyboardEvent, useMemo, useState } from "react";

import styles from "/src/ui/common/form/keywordsField.module.css";
import FormField from "/src/ui/common/form/FormField/FormField";

type KeywordsFieldProps = {
  label: string;
  value: string[];
  suggestions: string[];
  onChange: (keywords: string[]) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
};
const KeywordsField = ({
  label,
  value,
  suggestions,
  onChange,
  error,
  hint,
  placeholder,
  disabled,
  isLoading,
}: KeywordsFieldProps) => {
  return (
    <FormField label={label} error={error} hint={hint} className={styles.field}>
      <KeywordMultiSelect
        value={value}
        suggestions={suggestions}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        isLoading={isLoading}
        hasError={Boolean(error)}
      />
      
    </FormField>
  );
};

export default KeywordsField;

// Everything below this comment is here because for some reason when i try to move it to its own file vite complains about not existing file! (20 minutes tried to fix it -> gave up, not worth it)
const normalize = (value: string) => value.trim();
const toKey = (value: string) => normalize(value).toLowerCase();

const keywordExists = (list: string[], candidate: string) => {
  const candidateKey = toKey(candidate);
  return list.some((item) => toKey(item) === candidateKey);
};

type KeywordMultiSelectProps = {
  value: string[];
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  hasError?: boolean;
  onChange: (keywords: string[]) => void;
};

const KeywordMultiSelect = ({
  value,
  suggestions,
  placeholder,
  disabled,
  isLoading,
  onChange,
  className,
  hasError,
}: KeywordMultiSelectProps) => {
  const [inputValue, setInputValue] = useState("");

  const filteredSuggestions = useMemo(() => {
    const query = toKey(inputValue);

    return suggestions
      .filter((suggestion) => !keywordExists(value, suggestion))
      .filter((suggestion) => {
        if (!query) {
          return true;
        }

        return toKey(suggestion).includes(query);
      })
      .slice(0, 8);
  }, [inputValue, suggestions, value]);

  const typeaheadSuggestion = useMemo(() => {
    const query = toKey(inputValue);
    if (!query) {
      return "";
    }

    return (
      filteredSuggestions.find((suggestion) =>
        toKey(suggestion).startsWith(query),
      ) ?? ""
    );
  }, [filteredSuggestions, inputValue]);

  const typeaheadDisplay = useMemo(() => {
    if (!typeaheadSuggestion) {
      return "";
    }

    if (toKey(typeaheadSuggestion) === toKey(inputValue)) {
      return "";
    }

    return typeaheadSuggestion;
  }, [typeaheadSuggestion, inputValue]);

  const acceptTypeahead = () => {
    if (!typeaheadDisplay) {
      return false;
    }

    setInputValue(typeaheadSuggestion);
    return true;
  };

  const handleAdd = (keyword: string) => {
    const normalized = normalize(keyword);
    if (!normalized || keywordExists(value, normalized)) {
      setInputValue("");
      return;
    }

    onChange([...value, normalized]);
    setInputValue("");
  };

  const handleRemove = (keyword: string) => {
    const keywordKey = toKey(keyword);
    onChange(value.filter((item) => toKey(item) !== keywordKey));
  };

  const handleBackspace = () => {
    if (!value.length) {
      return;
    }

    const nextKeywords = value.slice(0, -1);
    onChange(nextKeywords);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const isCaretAtEnd =
      event.currentTarget.selectionStart === event.currentTarget.value.length &&
      event.currentTarget.selectionEnd === event.currentTarget.value.length;

    if (
      (event.key === "Tab" || event.key === "ArrowRight") &&
      typeaheadDisplay &&
      isCaretAtEnd
    ) {
      const accepted = acceptTypeahead();
      if (accepted) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      if (!inputValue.trim()) {
        return;
      }

      event.preventDefault();
      handleAdd(inputValue);
      return;
    }

    if (event.key === "Backspace" && !inputValue) {
      event.preventDefault();
      handleBackspace();
    }
  };

  const containerClassName = [
    styles.keywordSelector,
    hasError && styles.keywordSelectorError,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClassName}>
      <div className={styles.wrapper}>
        <div className={styles.chips} aria-live="polite">
          {value.map((keyword) => (
            <span key={keyword} className={styles.chip}>
              {keyword}
              <button
                type="button"
                onClick={() => handleRemove(keyword)}
                aria-label={`Remove ${keyword}`}
                disabled={disabled}
                className={styles.removeButton}
              >
                &times;
              </button>
            </span>
          ))}
          <div className={styles.typeaheadWrapper}>
            {typeaheadDisplay && !disabled && (
              <span className={styles.typeaheadGhost} aria-hidden="true">
                {typeaheadDisplay}
              </span>
            )}
            <input
              className={styles.input}
              placeholder={placeholder}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              aria-label="Add keywords"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <div className={styles.meta}>
        {isLoading && (
          <span className={styles.status}>Loading suggestions...</span>
        )}
        {!isLoading && filteredSuggestions.length > 0 && (
          <div className={styles.suggestions}>
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAdd(suggestion)}
                disabled={disabled}
                className={styles.suggestionButton}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {!isLoading &&
          !filteredSuggestions.length &&
          suggestions.length > 0 && (
            <span className={styles.status}>
              No matches. Press Enter to add a custom keyword.
            </span>
          )}
      </div>
    </div>
  );
};