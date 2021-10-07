import re
from pathlib import Path
import stille_splitten.sequences
from .init import db
from .consts import NO_RESULT
from .models import File, Result, Sequence

expectation_pattern=re.compile(r'^([0-9]+)-') 
def get_expectation(file):
    file_name=str(Path(file.path).stem)
    expectation=0

    match=re.match(expectation_pattern, file_name)
    if match is not None:
        try:
            expectation=int(match[1])
            return expectation
        except Exception as non_critical_error:
            return 0
    return expectation

def sequences_to_result(file, plausibility, all_sequences):
    result=Result(file = file, plausibility = plausibility)
    for sequences in all_sequences:
        if isinstance(sequences, list):
            sequences_to_result(file, plausibility, sequences)
        elif isinstance(sequences, dict):
            sequence=Sequence.from_dict(result = result, **sequences)
            db.session.add(sequence)
    db.session.add(result)
    db.session.commit()



def search_sequences(file_id):
    file=File.from_id(file_id)
    try:
        expectation=get_expectation(file)
        all_sequences, plausibility=stille_splitten.sequences.search_sequences(
            file.path, expectation)
    except Exception:
        all_sequences=None

    if all_sequences is None:
        result=Result(file = file, plausibility = NO_RESULT)
        db.session.add(result)
        db.session.commit()
    else:
        sequences_to_result(file, plausibility, all_sequences)
