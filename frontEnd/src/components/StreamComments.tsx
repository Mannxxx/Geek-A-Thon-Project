import React, { useEffect, useState } from 'react'
import { useFetch } from 'src/hooks';
import { ErrorPendingComp } from './ErrorPendingComp';
import { timeDiff } from 'src/util/time';

export function StreamComments({ streamId }: {
    streamId: string
}) {

    const [newComment, setNewComment] = useState('');
    const { data, isPending, error, fetchData, setData } = useFetch();

    const { data: dataComment, isPending: isPendingComment, error: commentError, fetchData: commentFetch } = useFetch();

    useEffect(() => {
        if (!streamId) return;
        fetchData({ path: `/comments/${streamId}` })
    }, [streamId])


    function handleNewComment(e: any) {

        e?.preventDefault();

        if (!newComment) return;


        commentFetch({
            path: `/comment`,
            method: 'POST',
            body: JSON.stringify({
                stream_id: streamId,
                content: newComment
            })
        })
    }

    useEffect(() => {
        if (!data || !dataComment || !dataComment?.id) return;

        setData([{
            comment_id: dataComment.id,
            commented_at: new Date(),
            content: newComment,
            email: "You",
            parent_comment_id: null,
            stream_id: streamId,
        }, ...data])

        setNewComment('');
    }, [dataComment])

    return (
        <div className="row mt-4">
            <h4>Comments</h4>
            {data && (isPendingComment || commentError) ?
                <ErrorPendingComp
                    isPending={isPendingComment}
                    error={commentError}
                    pendingText={"Adding your comment ..."}
                    placeholder={"Your new comment Here"}
                /> :
                <form style={{ width: '100%' }} onSubmit={handleNewComment}>
                    <div className='form-group' style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: 20
                    }}>
                        <input
                            type="text"
                            className='form-control'
                            style={{ width: "100%" }}
                            value={newComment}
                            onInput={(e: any) => {
                                setNewComment(e.target.value)
                            }}
                            placeholder='Add a comment'
                        />
                        {newComment ?
                            <button
                                type='submit'
                                className="btn btn-primary"
                                onClick={handleNewComment}>
                                Comment
                            </button>
                            : null
                        }
                    </div>
                </form>
            }
            {!data || isPending || error ?
                <ErrorPendingComp
                    isPending={isPending}
                    error={error}
                    pendingText={"Loading ..."}
                    placeholder={"Comments Here"}
                /> :
                <div className="card-group">
                    {data.map((item: any, index: number) =>
                        <div key={index} className="col-12 mt-3">
                            <div className="card">
                                <div className="card-body">
                                    <div
                                        style={{
                                            display: 'flex',
                                            columnGap: 20,
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <div>
                                            <i className="fas fa-user" style={{ fontSize: 30 }}></i>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <strong>{item.email}</strong>
                                            <span>{item.content}</span>
                                            <p>{timeDiff(item.commented_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}
