from .stt import transcribe


def process_audio(audio_path):

    result = transcribe(audio_path)

    return {

        "transcript":
            result.get(
                "refined_text",
                ""
            ),

        "dispatch_data":
            result.get(
                "dispatch",
                []
            )
    }