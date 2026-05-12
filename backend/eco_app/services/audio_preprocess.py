from pydub import AudioSegment


def preprocess_audio(
    input_path,
    output_path
):

    audio = AudioSegment.from_file(
        input_path
    )

    audio = audio.set_channels(1)

    audio = audio.set_frame_rate(16000)

    audio = audio + 15

    audio = audio.low_pass_filter(3000)

    audio.export(
        output_path,
        format="wav"
    )