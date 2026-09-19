import { useState } from 'react';

function EditTaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title ?? '');
  const [isComplete, setIsComplete] = useState(
    Boolean(task.is_complete),
  );

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [saveError, setSaveError] = useState('');

  const trimmedTitle = title.trim();

  const hasChanges =
    trimmedTitle !== task.title ||
    isComplete !== Boolean(task.is_complete);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setValidationError('');
    setSaveError('');

    if (!trimmedTitle) {
      setValidationError('Task title cannot be empty.');
      return;
    }

    if (trimmedTitle.length > 80) {
      setValidationError(
        'Task title cannot exceed 80 characters.',
      );
      return;
    }

    if (!hasChanges) return;

    setSubmitting(true);

    try {
      await onSave({
        title: trimmedTitle,
        is_complete: isComplete,
      });
    } catch (error) {
      setSaveError(
        error.message || 'Could not save the task. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="task-edit-form"
      onSubmit={handleSubmit}
      aria-busy={submitting}
    >
      <fieldset
        className="task-edit-form__fields"
        disabled={submitting}
      >
        <legend className="sr-only">Task information</legend>

        <div className="task-edit-form__field">
          <label htmlFor="edit-task-title">
            Task title
          </label>

          <input
            id="edit-task-title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setValidationError('');
              setSaveError('');
            }}
            minLength={1}
            maxLength={80}
            required
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError
                ? 'edit-task-title-help edit-task-title-error'
                : 'edit-task-title-help'
            }
          />

          <div className="task-edit-form__help">
            <span id="edit-task-title-help">
              Use a clear title, up to 80 characters.
            </span>

            <span>{title.length}/80</span>
          </div>

          {validationError && (
            <p
              id="edit-task-title-error"
              className="error-text"
              role="alert"
            >
              {validationError}
            </p>
          )}
        </div>

        <label className="task-edit-form__checkbox">
          <input
            name="is_complete"
            type="checkbox"
            checked={isComplete}
            onChange={(event) => {
              setIsComplete(event.target.checked);
              setSaveError('');
            }}
          />

          <span>Mark this task as completed</span>
        </label>
      </fieldset>

      {saveError && (
        <p className="error-text" role="alert">
          {saveError}
        </p>
      )}

      <div className="task-edit-form__actions">
        <button
          type="submit"
          className="task-edit-form__save"
          disabled={submitting || !hasChanges}
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>

        <button
          type="button"
          className="task-edit-form__cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditTaskForm;
