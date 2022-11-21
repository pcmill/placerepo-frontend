function PageLayout(props) {
    return (
        <div className="flex-1 py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {props.children}
            </div>
        </div>
    )
}

export default PageLayout;