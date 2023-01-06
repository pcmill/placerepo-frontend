function EditTranslationQueue(props) {
    const q = props.queueItem;

    return (
        <>
            <div className="flex items-center">
                {<p className="text-md text-gray-600">
                    Change translation <span className="font-medium">{q.request.translation_id}</span> to <span className="font-medium">{q.request.name}</span>
                </p>}
            </div>
        </>
    )
}

export default EditTranslationQueue;